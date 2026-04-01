package com.moeAlfarra.memory_allocation_simulator;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/memory-allocate")
@CrossOrigin(origins = "https://memory-allocation-simulator-rose.vercel.app")  // Change if running frontend locally/different host
public class MemoryAllocationController {
    private final MemoryAllocationService memoryAllocationService;

    public MemoryAllocationController(MemoryAllocationService memoryAllocationService) {
        this.memoryAllocationService = memoryAllocationService;
    }

    @PostMapping
    public MemoryAllocationResult allocate(@RequestBody MemoryAllocationRequest request) {
        switch(request.getAlgorithm()) {
            case "FIRST_FIT":
                return memoryAllocationService.firstFit(request.getBlocks(), request.getProcesses());
            case "BEST_FIT":
                return memoryAllocationService.bestFit(request.getBlocks(), request.getProcesses());
            case "WORST_FIT":
                return memoryAllocationService.worstFit(request.getBlocks(), request.getProcesses());
            case "NEXT_FIT":
                return memoryAllocationService.nextFit(request.getBlocks(), request.getProcesses());
            default:
                throw new IllegalArgumentException("Invalid algorithm" + request.getAlgorithm());
        }
    }
}
