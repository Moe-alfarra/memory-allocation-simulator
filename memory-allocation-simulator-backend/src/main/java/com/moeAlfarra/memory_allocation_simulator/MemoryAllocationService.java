package com.moeAlfarra.memory_allocation_simulator;

import org.springframework.stereotype.Service;
import java.util.Arrays;
@Service
public class MemoryAllocationService {

    // First-Fit
    public MemoryAllocationResult firstFit(int[] blocks, int[] processes) {
        int[] allocation = new int[processes.length];
        int[] workingBlocks = blocks.clone();
        Arrays.fill(allocation, -1);

        // Algorithm
        for (int i = 0; i < processes.length; i++) {
            for (int j = 0; j < workingBlocks.length; j++) {
                if (workingBlocks[j] >= processes[i]) {
                    allocation[i] = j; // stores the allocated block index for each process
                    workingBlocks[j] -= processes[i]; // updates remaining size of the chosen block
                    break;
                }
            }
        }
        return new MemoryAllocationResult("FIRST_FIT", blocks, processes, allocation, workingBlocks); // return result
    }

    // Best Fit
    public MemoryAllocationResult bestFit(int[] blocks, int[] processes) {
        int[] allocation = new int[processes.length];
        int[] workingBlocks = blocks.clone();
        Arrays.fill(allocation, -1);

        // Algorithm
        for (int i = 0; i < processes.length; i++) {
            int bestIndex = -1;
            for (int j = 0; j < workingBlocks.length; j++) {
                if (workingBlocks[j] >= processes[i]) {
                    if (bestIndex == -1 || workingBlocks[j] < workingBlocks[bestIndex]) {
                        bestIndex = j;
                    }
                }
            }
            if (bestIndex != -1) {
                allocation[i] = bestIndex; // stores the allocated block index for each process
                workingBlocks[bestIndex] -= processes[i]; // updates remaining size of the chosen block
            }
        }
        return new MemoryAllocationResult("BEST_FIT", blocks, processes, allocation, workingBlocks); // return result
    }
    // Worst Fit
    public MemoryAllocationResult worstFit(int[] blocks, int[] processes) {
        int[] allocation = new int[processes.length];
        int[] workingBlocks = blocks.clone();
        Arrays.fill(allocation, -1);

        // Algorithm
        for (int i = 0; i < processes.length; i++) {
            int worstIndex = -1;
            for (int j = 0; j < workingBlocks.length; j++) {
                if (workingBlocks[j] >= processes[i]) {
                    if (worstIndex == -1 || workingBlocks[j] > workingBlocks[worstIndex]) {
                        worstIndex = j;
                    }
                }
            }
            if (worstIndex != -1) {
                allocation[i] = worstIndex; // stores the allocated block index for each process
                workingBlocks[worstIndex] -= processes[i]; // updates remaining size of the chosen block
            }
        }
        return new MemoryAllocationResult("WORST_FIT", blocks, processes, allocation, workingBlocks); // return result
    }
    // Next Fit
    public MemoryAllocationResult nextFit(int[] blocks, int[] processes) {
        int[] allocation = new int[processes.length];
        int[] workingBlocks = blocks.clone();
        Arrays.fill(allocation, -1);

        // Algorithm
        int lastIndex = 0;
        for (int i = 0; i < processes.length; i++) {
            int checked = 0;
            int j = lastIndex;
            while (checked < workingBlocks.length) {
                if (workingBlocks[j] >= processes[i]) {
                    allocation[i] = j; // stores the allocated block index for each process
                    workingBlocks[j] -= processes[i]; // updates remaining size of the chosen block
                    lastIndex = j;
                    break;
                }
                j = (j + 1) % workingBlocks.length;
                checked++;
            }
        }

        return new MemoryAllocationResult("NEXT_FIT", blocks, processes, allocation, workingBlocks); // return result
    }

}
