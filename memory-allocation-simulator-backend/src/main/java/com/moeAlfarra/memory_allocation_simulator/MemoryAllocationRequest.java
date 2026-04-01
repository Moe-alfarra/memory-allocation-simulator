package com.moeAlfarra.memory_allocation_simulator;

public class MemoryAllocationRequest {
    private int[] blocks;
    private int[] processes;
    private String algorithm;

    public MemoryAllocationRequest() {

    }
    public MemoryAllocationRequest(int[] blocks, int[] processes) {
        this.blocks = blocks;
        this.processes = processes;
    }
    public MemoryAllocationRequest(int[] blocks, int[] processes, String  algorithm) {
        this.blocks = blocks;
        this.processes = processes;
        this.algorithm = algorithm;
    }
    public int[] getBlocks() {
        return blocks;
    }

    public void setBlocks(int[] blocks) {
        this.blocks = blocks;
    }

    public int[] getProcesses() {
        return processes;
    }

    public void setProcesses(int[] processes) {
        this.processes = processes;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }
}
