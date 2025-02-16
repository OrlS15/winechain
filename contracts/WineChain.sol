// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract WineChain {
    address public owner;       // Owner of the contract

    struct HistoryEntry {
        string phase;           // Phase ('harvesting', 'destemming', 'fermentation', 'maturation', 'bottling')
        string description;     // Description
        uint256 timestamp;      // Timestamp
    }

    struct WineBatch {
        uint256 id;             // Id
        string name;            // Name
        string grapeType;       // Grape Type
        uint256 createdAt;      // Timestamp of creation
        HistoryEntry[] history; // History of production phases
    }

    mapping(uint256 => WineBatch) private wineBatches; // Mapping of wine batches (id => WineBatch)
    uint256[] private batchIds;                        // Store the list of batch IDs for easy access

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Access Denied: Only the owner can perform this function");
        _; 
    }

    function addWineBatch(
        uint256 _id,        // Allow specifying the ID directly
        string memory _name,
        string memory _grapeType
    ) public onlyOwner {
        require(wineBatches[_id].id == 0, "Batch ID already exists");
        require(bytes(_name).length > 0, "Wine name cannot be empty");
        require(bytes(_grapeType).length > 0, "Grape type cannot be empty");

        WineBatch storage newBatch = wineBatches[_id];
        newBatch.id = _id;
        newBatch.name = _name;
        newBatch.grapeType = _grapeType;
        newBatch.createdAt = block.timestamp; // Set the creation timestamp

        batchIds.push(_id); // Store the batch ID
    }

    function removeWineBatch(uint256 _id) public onlyOwner {
        require(wineBatches[_id].id != 0, "Batch ID does not exist");

        // Remove the batch by replacing it with the last element
        uint256 index = findBatchIndex(_id);
        uint256 lastBatchId = batchIds[batchIds.length - 1];
        
        // Swap the last batch with the one to be removed
        batchIds[index] = lastBatchId;
        batchIds.pop(); // Remove the last element

        // Delete the batch from the mapping
        delete wineBatches[_id];
    }

    function getAllBatches() public onlyOwner view returns (WineBatch[] memory) {
        WineBatch[] memory batches = new WineBatch[](batchIds.length);
        for (uint256 i = 0; i < batchIds.length; i++) {
            batches[i] = wineBatches[batchIds[i]];
        }
        return batches;
    }

    function getBatchInfo(uint256 _id) public view returns (WineBatch memory) {
        require(wineBatches[_id].id != 0, "Batch ID does not exist");
        return wineBatches[_id];
    }

    function editWineBatchInfo(
        uint256 _id,
        string memory _name,
        string memory _grapeType
    ) public onlyOwner {
        require(wineBatches[_id].id != 0, "Batch ID does not exist");

        WineBatch storage batch = wineBatches[_id];

        if (bytes(_name).length > 0) {
            batch.name = _name;
        }

        if (bytes(_grapeType).length > 0) {
            batch.grapeType = _grapeType;
        }
    }

    function addWineBatchHistory(
        uint256 _id,
        string memory _phase,
        string memory _description
    ) public onlyOwner {
        require(wineBatches[_id].id != 0, "Batch ID does not exist");
        require(bytes(_phase).length > 0, "Phase cannot be empty");

        HistoryEntry memory entry = HistoryEntry({
            phase: _phase,
            description: _description,
            timestamp: block.timestamp
        });

        wineBatches[_id].history.push(entry);
    }

    function findBatchIndex(uint256 _id) internal view returns (uint256) {
        for (uint256 i = 0; i < batchIds.length; i++) {
            if (batchIds[i] == _id) {
                return i;
            }
        }
        revert("Batch ID not found");
    }
}
