package com.moeAlfarra.memory_allocation_simulator;

public class MemoryAllocationResult {

    private String algorithm;
    private int[] originalBlocks;
    private int[] processes;
    private int[] allocation;
    private int[] remainingBlocks;

    public MemoryAllocationResult() {

    }

    public MemoryAllocationResult(String algorithm, int[] originalBlocks, int[] processes,
                                  int[] allocation, int[] remainingBlocks) {
        this.algorithm = algorithm;
        this.originalBlocks = originalBlocks;
        this.processes = processes;
        this.allocation = allocation;
        this.remainingBlocks = remainingBlocks;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public int[] getOriginalBlocks() {
        return originalBlocks;
    }

    public void setOriginalBlocks(int[] originalBlocks) {
        this.originalBlocks = originalBlocks;
    }

    public int[] getProcesses() {
        return processes;
    }

    public void setProcesses(int[] processes) {
        this.processes = processes;
    }

    public int[] getAllocation() {
        return allocation;
    }

    public void setAllocation(int[] allocation) {
        this.allocation = allocation;
    }

    public int[] getRemainingBlocks() {
        return remainingBlocks;
    }

    public void setRemainingBlocks(int[] remainingBlocks) {
        this.remainingBlocks = remainingBlocks;
    }
}
