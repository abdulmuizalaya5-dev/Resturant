import React from 'react';

// 1. Line / Area Chart for Booking Trends or Customer Growth
interface AreaChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  fillColor?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  height = 200,
  color = '#f59e0b', // Amber 500
  fillColor = 'rgba(245, 158, 11, 0.08)'
}) => {
  const maxVal = Math.max(...data.map(d => d.value), 1) * 1.15;
  const padding = 30;
  const chartHeight = height - padding * 2;
  
  // Calculate points
  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (500 - padding * 2);
    const y = padding + chartHeight - (d.value / maxVal) * chartHeight;
    return { x, y };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  return (
    <div className="w-full">
      <svg viewBox={`0 0 500 ${height}`} className="w-full overflow-visible">
        {/* Y Axis Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
          const y = padding + chartHeight - r * chartHeight;
          return (
            <g key={idx} className="opacity-10">
              <line x1={padding} y1={y} x2={500 - padding} y2={y} stroke="#fff" strokeWidth={1} />
              <text x={padding - 8} y={y + 4} textAnchor="end" fontSize={10} fill="#fff">
                {Math.round(r * maxVal)}
              </text>
            </g>
          );
        })}

        {/* Fill Area */}
        {areaD && <path d={areaD} fill={fillColor} />}

        {/* Line Path */}
        {pathD && <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />}

        {/* Data Circles */}
        {points.map((p, idx) => (
          <g key={idx} className="group">
            <circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill="#fff"
              stroke={color}
              strokeWidth={2}
              className="cursor-pointer transition-all duration-300 hover:r-6"
            />
            <title>{`${data[idx].label}: ${data[idx].value}`}</title>
          </g>
        ))}

        {/* X Axis Labels */}
        {data.map((d, index) => {
          const x = padding + (index / (data.length - 1)) * (500 - padding * 2);
          return (
            <text
              key={index}
              x={x}
              y={height - 10}
              textAnchor="middle"
              fontSize={10}
              fill="#6b7280"
              className="font-semibold"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// 2. Bar Chart for Monthly Revenue
interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  prefix?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  color = '#f59e0b',
  prefix = ''
}) => {
  const maxVal = Math.max(...data.map(d => d.value), 1) * 1.15;
  const padding = 30;
  const chartHeight = height - padding * 2;
  const barWidth = Math.max(15, (500 - padding * 2) / data.length - 12);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 500 ${height}`} className="w-full overflow-visible">
        {/* Y Axis Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
          const y = padding + chartHeight - r * chartHeight;
          return (
            <g key={idx} className="opacity-10">
              <line x1={padding} y1={y} x2={500 - padding} y2={y} stroke="#fff" strokeWidth={1} />
              <text x={padding - 8} y={y + 4} textAnchor="end" fontSize={10} fill="#fff">
                {prefix}{Math.round(r * maxVal)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, idx) => {
          const x = padding + (idx / data.length) * (500 - padding * 2) + 6;
          const barHeight = (d.value / maxVal) * chartHeight;
          const y = padding + chartHeight - barHeight;

          return (
            <g key={idx} className="group">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx={4}
                className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              />
              <title>{`${d.label}: ${prefix}${d.value}`}</title>
            </g>
          );
        })}

        {/* X Axis Labels */}
        {data.map((d, idx) => {
          const x = padding + (idx / data.length) * (500 - padding * 2) + barWidth / 2 + 6;
          return (
            <text
              key={idx}
              x={x}
              y={height - 10}
              textAnchor="middle"
              fontSize={10}
              fill="#6b7280"
              className="font-semibold"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
