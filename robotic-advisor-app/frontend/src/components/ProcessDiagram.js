import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

const ProcessDiagram = ({ analysisResults }) => {
  // Generate nodes and edges based on analysis results
  const generateFlowElements = () => {
    if (!analysisResults || !analysisResults.video_analysis) {
      return { nodes: [], edges: [] };
    }
    
    const { tasks, processes } = analysisResults.video_analysis;
    
    // Create nodes for tasks
    const taskNodes = tasks.map((task, index) => ({
      id: `task-${index}`,
      type: 'default',
      data: { 
        label: (
          <div>
            <strong>{task.name}</strong>
            <div>Duration: {task.duration}s</div>
            <div>Complexity: {task.complexity}</div>
          </div>
        ) 
      },
      position: { x: 250, y: 100 + index * 150 },
      style: {
        background: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        width: 180,
      },
    }));
    
    // Create nodes for processes
    const processNodes = processes.map((process, index) => ({
      id: `process-${index}`,
      type: 'default',
      data: { 
        label: (
          <div>
            <strong>{process.name}</strong>
            <div>Automation: {process.automation_potential}</div>
          </div>
        ) 
      },
      position: { x: 500, y: 100 + index * 150 },
      style: {
        background: '#e3f2fd',
        border: '1px solid #90caf9',
        borderRadius: '8px',
        padding: '10px',
        width: 180,
      },
    }));
    
    // Create a start node
    const startNode = {
      id: 'start',
      type: 'input',
      data: { label: 'Start Process' },
      position: { x: 50, y: 100 + (tasks.length * 150) / 2 - 75 },
      style: {
        background: '#e8f5e9',
        border: '1px solid #66bb6a',
        borderRadius: '8px',
        padding: '10px',
        width: 150,
      },
    };
    
    // Create edges connecting tasks
    const taskEdges = [];
    
    // Connect start to first task
    if (taskNodes.length > 0) {
      taskEdges.push({
        id: `start-to-${taskNodes[0].id}`,
        source: 'start',
        target: taskNodes[0].id,
        animated: true,
        style: { stroke: '#66bb6a' },
      });
    }
    
    // Connect tasks in sequence
    for (let i = 0; i < taskNodes.length - 1; i++) {
      taskEdges.push({
        id: `${taskNodes[i].id}-to-${taskNodes[i + 1].id}`,
        source: taskNodes[i].id,
        target: taskNodes[i + 1].id,
        animated: true,
      });
    }
    
    // Connect tasks to related processes
    const processEdges = [];
    taskNodes.forEach((taskNode, taskIndex) => {
      processNodes.forEach((processNode, processIndex) => {
        // Simple logic to connect tasks to processes - in a real app, this would be based on actual relationships
        if (taskIndex % processNodes.length === processIndex) {
          processEdges.push({
            id: `${taskNode.id}-to-${processNode.id}`,
            source: taskNode.id,
            target: processNode.id,
            animated: false,
            style: { stroke: '#90caf9', strokeDasharray: '5,5' },
          });
        }
      });
    });
    
    return {
      nodes: [startNode, ...taskNodes, ...processNodes],
      edges: [...taskEdges, ...processEdges],
    };
  };
  
  const { nodes: initialNodes, edges: initialEdges } = generateFlowElements();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  if (!analysisResults) {
    return <div className="card">No analysis data available for diagram</div>;
  }
  
  return (
    <div className="card">
      <h2>Process Diagram</h2>
      <div style={{ height: 500 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ProcessDiagram;