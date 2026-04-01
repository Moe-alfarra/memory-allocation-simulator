import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Cpu,
  Play,
  Plus,
  Trash2,
  Sparkles,
  Activity,
  BarChart3,
  RefreshCw,
  Workflow,
  Layers3,
  MemoryStick,
  Boxes,
  Gauge,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/memory-allocate"; // // Change if running backend locally/different host

const STARTER_BLOCKS = [100, 500, 200, 300, 600];
const STARTER_PROCESSES = [212, 417, 112, 426];
const DEFAULT_ITEM_SIZE = 100;

const ALGORITHMS = [
  { value: "FIRST_FIT", label: "First Fit" },
  { value: "BEST_FIT", label: "Best Fit" },
  { value: "WORST_FIT", label: "Worst Fit" },
  { value: "NEXT_FIT", label: "Next Fit" },
];

const algorithmDescriptions = {
  FIRST_FIT: "Allocates the first memory block large enough to hold the process. Fast but may cause fragmentation.",
  BEST_FIT: "Allocates the smallest block that can fit the process. Reduces wasted space but requires searching all blocks.",
  WORST_FIT: "Allocates the largest available block. Leaves larger leftover spaces for future allocations.",
  NEXT_FIT: "Similar to First Fit but continues searching from the last allocated block instead of starting from the beginning."
};

const PROCESS_COLORS = [
  "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
  "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
  "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
  "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
  "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
  "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
];

const BLOCK_BADGE_STYLE = {
  background: "linear-gradient(135deg, #334155 0%, #0f172a 100%)",
  color: "#ffffff",
};

const FREE_SEGMENT_STYLE = {
  background: "linear-gradient(135deg, #334155 0%, #0f172a 100%)",
  color: "#e2e8f0",
};

function getProcessStyle(processNumber) {
  const idx = (processNumber - 1) % PROCESS_COLORS.length;
  return {
    background: PROCESS_COLORS[idx],
    color: "#ffffff",
  };
}

function formatAlgorithmName(value) {
  return value.replaceAll("_", " ");
}

function formatMetric(value) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return "0";
  return Number(value).toFixed(0);
}

function normalizePositiveNumber(value) {
  return Math.max(1, Number(value) || 1);
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="section-title">
      <div className="section-title-icon">
        <Icon size={18} />
      </div>
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, suffix, delay }) {
  return (
    <motion.div
      className="metric-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <div className="metric-icon-wrap">
        <Icon size={18} />
      </div>
      <div>
        <div className="metric-label">{label}</div>
        <div className="metric-value">
          {value}
          <span>{suffix}</span>
        </div>
      </div>
    </motion.div>
  );
}

function MemoryChart({ result }) {
  const rows = useMemo(() => {
    if (!result?.originalBlocks?.length) return [];

    return result.originalBlocks.map((blockSize, blockIndex) => {
      const segments = [];
      let used = 0;

      result.processes.forEach((processSize, processIndex) => {
        if (result.allocation[processIndex] === blockIndex) {
          used += processSize;
          segments.push({
            type: "process",
            label: `P${processIndex + 1}`,
            size: processSize,
            processNumber: processIndex + 1,
          });
        }
      });

      const remaining = result.remainingBlocks[blockIndex];
      if (remaining > 0) {
        segments.push({
          type: "free",
          label: "Free",
          size: remaining,
        });
      }

      return {
        blockNumber: blockIndex + 1,
        originalSize: blockSize,
        used,
        remaining,
        segments,
      };
    });
  }, [result]);

  if (!rows.length) {
    return (
      <div className="empty-state">
        <div className="empty-glow" />
        <Workflow size={28} />
        <h3>No simulation yet</h3>
        <p>Run the simulator to render the animated memory layout chart.</p>
      </div>
    );
  }

  return (
    <div className="gantt-shell">
      {rows.map((row, rowIndex) => (
        <motion.div
          key={`block-${row.blockNumber}`}
          className="memory-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: rowIndex * 0.05 }}
        >
          <div className="memory-row-top">
            <span className="memory-row-title">Block {row.blockNumber}</span>
            <span className="memory-row-meta">
              {row.originalSize} KB total • {row.used} KB used • {row.remaining} KB free
            </span>
          </div>

          <div className="gantt-track">
            {row.segments.map((segment, index) => {
              const widthPercent = row.originalSize
                ? (segment.size / row.originalSize) * 100
                : 0;

              const style =
                segment.type === "process"
                  ? getProcessStyle(segment.processNumber)
                  : FREE_SEGMENT_STYLE;

              return (
                <motion.div
                  key={`${row.blockNumber}-${segment.label}-${index}`}
                  className="gantt-block"
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.24, delay: index * 0.05 }}
                  style={{
                    width: `${Math.max(widthPercent, 8)}%`,
                    minWidth: "76px",
                    background: style.background,
                    color: style.color,
                  }}
                >
                  <div className="gantt-block-title">{segment.label}</div>
                  <div className="gantt-block-subtitle">{segment.size} KB</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function App() {
  const [algorithm, setAlgorithm] = useState("FIRST_FIT");
  const [blocks, setBlocks] = useState(STARTER_BLOCKS);
  const [processes, setProcesses] = useState(STARTER_PROCESSES);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewRows = useMemo(() => {
    return Array.from({ length: Math.max(blocks.length, processes.length) });
  }, [blocks.length, processes.length]);

  const totalMemory = useMemo(
    () => result?.originalBlocks?.reduce((sum, value) => sum + value, 0) || 0,
    [result]
  );

  const freeMemory = useMemo(
    () => result?.remainingBlocks?.reduce((sum, value) => sum + value, 0) || 0,
    [result]
  );

  const usedMemory = totalMemory - freeMemory;

  const allocatedCount = useMemo(
    () => result?.allocation?.filter((item) => item !== -1).length || 0,
    [result]
  );

  function updateListValue(setter, list, index, value) {
    const next = [...list];
    next[index] = normalizePositiveNumber(value);
    setter(next);
  }

  function addListItem(setter) {
    setter((prev) => [...prev, DEFAULT_ITEM_SIZE]);
  }

  function removeListItem(setter, list, index) {
    if (list.length === 1) return;
    setter((prev) => prev.filter((_, i) => i !== index));
  }

  function resetState(nextBlocks, nextProcesses, nextAlgorithm = "FIRST_FIT") {
    setBlocks(nextBlocks);
    setProcesses(nextProcesses);
    setAlgorithm(nextAlgorithm);
    setResult(null);
    setError("");
  }

  function loadDemo() {
    resetState(STARTER_BLOCKS, STARTER_PROCESSES);
  }

  function resetAll() {
    resetState([DEFAULT_ITEM_SIZE], [DEFAULT_ITEM_SIZE]);
  }

  function generateRandom() {
    const blockCount = Math.floor(Math.random() * 3) + 4;
    const processCount = Math.floor(Math.random() * 3) + 4;

    const randomBlocks = Array.from(
      { length: blockCount },
      () => Math.floor(Math.random() * 500) + 100
    );

    const randomProcesses = Array.from(
      { length: processCount },
      () => Math.floor(Math.random() * 450) + 50
    );

    resetState(randomBlocks, randomProcesses, algorithm);
  }

  async function runSimulation() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        blocks: blocks.map(Number),
        processes: processes.map(Number),
        algorithm,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        "Could not connect to the backend. Make sure Spring Boot is running on http://localhost:8080 and your controller allows requests from http://localhost:5173."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="background-orb orb-1" />
      <div className="background-orb orb-2" />
      <div className="background-grid" />

      <main className="container">
        <motion.section
          className="hero glass"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="hero-copy">
            <div className="badge">
              <Sparkles size={14} />
              Memory Allocation Simulator
            </div>

            <h1>Memory Allocation Simulator</h1>

            <p>
              Simulate First Fit, Best Fit, Worst Fit, and Next Fit with an animated memory chart visualization.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary" onClick={runSimulation} disabled={loading}>
                {loading ? <RefreshCw size={18} className="spin" /> : <Play size={18} />}
                {loading ? "Running..." : "Run Simulation"}
              </button>

              <button className="btn btn-secondary" onClick={loadDemo}>
                <Layers3 size={18} />
                Load Demo
              </button>

              <button className="btn btn-secondary" onClick={generateRandom}>
                <Sparkles size={18} />
                Random Data
              </button>

              <button className="btn btn-ghost" onClick={resetAll}>
                Reset
              </button>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-top">
              <div className="chip">
                <Cpu size={15} />
                Backend API
              </div>
              <span className="api-url">POST /api/memory-allocate</span>
            </div>

            <div className="mini-stats">
              <div className="mini-stat">
                <span>Algorithm</span>
                <strong>{formatAlgorithmName(algorithm)}</strong>
              </div>
              <div className="mini-stat">
                <span>Blocks</span>
                <strong>{blocks.length}</strong>
              </div>
              <div className="mini-stat">
                <span>Processes</span>
                <strong>{processes.length}</strong>
              </div>
            </div>

            <div className="preview-grid">
              {previewRows.map((_, index) => (
                <div className="preview-row" key={index}>
                  <div className="preview-pill process-pill">
                    {processes[index] !== undefined ? (
                      <>
                        <span>P{index + 1}</span>
                        <small>{processes[index]} KB</small>
                      </>
                    ) : (
                      <span className="preview-empty">—</span>
                    )}
                  </div>

                  <div className="preview-pill block-pill">
                    {blocks[index] !== undefined ? (
                      <>
                        <span>B{index + 1}</span>
                        <small>{blocks[index]} KB</small>
                      </>
                    ) : (
                      <span className="preview-empty">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="dashboard">
          <motion.div
            className="left-column"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="glass panel">
              <SectionTitle
                icon={Activity}
                title="Simulation Input"
                subtitle="Configure the algorithm and build your memory blocks and processes."
              />

              <div className="form-grid">
                <label className="field">
                  <span>Algorithm</span>
                  <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
                    {ALGORITHMS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Total Blocks</span>
                  <input type="number" value={blocks.length} disabled />
                </label>
              </div>

              <div className="input-toolbar">
                <h3>Memory Blocks</h3>
                <button className="btn btn-secondary small" onClick={() => addListItem(setBlocks)}>
                  <Plus size={16} />
                  Add Block
                </button>
              </div>

              <div className="process-list">
                <AnimatePresence>
                  {blocks.map((block, index) => (
                    <motion.div
                      layout
                      key={`block-${index}`}
                      className="process-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <div className="process-badge" style={BLOCK_BADGE_STYLE}>
                        B{index + 1}
                      </div>

                      <label className="field compact">
                        <span>Size (KB)</span>
                        <input
                          type="number"
                          min="1"
                          value={block}
                          onChange={(e) => updateListValue(setBlocks, blocks, index, e.target.value)}
                        />
                      </label>

                      <div />

                      <button
                        className="icon-btn"
                        onClick={() => removeListItem(setBlocks, blocks, index)}
                        disabled={blocks.length === 1}
                        aria-label={`Remove block ${index + 1}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="input-toolbar" style={{ marginTop: 22 }}>
                <h3>Processes</h3>
                <button className="btn btn-secondary small" onClick={() => addListItem(setProcesses)}>
                  <Plus size={16} />
                  Add Process
                </button>
              </div>

              <div className="process-list">
                <AnimatePresence>
                  {processes.map((process, index) => (
                    <motion.div
                      layout
                      key={`process-${index}`}
                      className="process-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <div className="process-badge" style={getProcessStyle(index + 1)}>
                        P{index + 1}
                      </div>

                      <label className="field compact">
                        <span>Size (KB)</span>
                        <input
                          type="number"
                          min="1"
                          value={process}
                          onChange={(e) =>
                            updateListValue(setProcesses, processes, index, e.target.value)
                          }
                        />
                      </label>

                      <div />

                      <button
                        className="icon-btn"
                        onClick={() => removeListItem(setProcesses, processes, index)}
                        disabled={processes.length === 1}
                        aria-label={`Remove process ${index + 1}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {error ? <div className="error-box">{error}</div> : null}
            </div>
          </motion.div>


          <div className="right-column">
            <motion.div
              className="glass panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionTitle
                icon={Activity}
                title="Algorithm Overview"
                subtitle="Quick explanation of the selected strategy."
              />

              <div className="algorithm-info">
                <h3 className="algorithm-title">
                  {ALGORITHMS.find((item) => item.value === algorithm)?.label}
                </h3>
                <p className="algorithm-description">
                  {algorithmDescriptions[algorithm]}
                </p>
              </div>
            </motion.div>
            <motion.div
              className="glass panel"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SectionTitle
                icon={Workflow}
                title="Animated Memory Chart"
                subtitle="Your backend allocation result appears here."
              />

              {loading ? (
                <div className="chart-loading">
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton-track">
                    <div className="skeleton-block" />
                    <div className="skeleton-block" />
                    <div className="skeleton-block" />
                  </div>
                  <div className="skeleton-row">
                    <div className="skeleton-chip" />
                    <div className="skeleton-chip" />
                    <div className="skeleton-chip" />
                  </div>
                </div>
              ) : (
                <MemoryChart result={result} />
              )}
            </motion.div>

            <motion.div
              className="glass panel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <SectionTitle
                icon={Layers3}
                title="Per-Process Results"
                subtitle="See where each process was allocated."
              />

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Process</th>
                      <th>Size</th>
                      <th>Status</th>
                      <th>Allocated Block</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result?.processes?.map((processSize, index) => (
                      <tr key={`row-${index}`}>
                        <td>
                          <span className="table-pill" style={getProcessStyle(index + 1)}>
                            P{index + 1}
                          </span>
                        </td>
                        <td>{processSize} KB</td>
                        <td>{result.allocation[index] === -1 ? "Not Allocated" : "Allocated"}</td>
                        <td>
                          {result.allocation[index] === -1
                            ? "-"
                            : `Block ${result.allocation[index] + 1}`}
                        </td>
                      </tr>
                    ))}

                    {!result?.processes?.length ? (
                      <tr>
                        <td colSpan="4" className="table-empty">
                          Results will appear here after you run the simulation.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <div className="metrics-grid">
              <MetricCard
                icon={MemoryStick}
                label="Total Memory"
                value={formatMetric(totalMemory)}
                suffix="KB"
                delay={0.04}
              />
              <MetricCard
                icon={BarChart3}
                label="Used Memory"
                value={formatMetric(usedMemory)}
                suffix="KB"
                delay={0.08}
              />
              <MetricCard
                icon={Gauge}
                label="Free Memory"
                value={formatMetric(freeMemory)}
                suffix="KB"
                delay={0.12}
              />
              <MetricCard
                icon={Boxes}
                label="Allocated Processes"
                value={formatMetric(allocatedCount)}
                suffix=""
                delay={0.16}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}