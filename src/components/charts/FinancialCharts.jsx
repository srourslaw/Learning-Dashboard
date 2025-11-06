import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

/**
 * Custom tooltip formatter for financial charts
 */
export function CustomTooltip({ active, payload, label, formatValue, labelPrefix = 'Year' }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-2 border-indigo-200 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-800 mb-2">
          {labelPrefix} {label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
            {entry.name}: {formatValue ? formatValue(entry.value) : `$${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

/**
 * Time-series line chart for financial data
 */
export function TimeSeriesLineChart({
  data,
  dataKeys = ['value'],
  colors = ['#6366f1'],
  title,
  xAxisLabel = 'Year',
  yAxisLabel = 'Value ($)',
  height = 300,
  formatValue,
  showGrid = true,
  showLegend = true
}) {
  return (
    <div className="w-full">
      {title && (
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
          <XAxis
            dataKey="year"
            label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }}
            stroke="#6b7280"
          />
          <YAxis
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
          {showLegend && <Legend />}
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index] || colors[0]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Area chart for cumulative growth visualization
 */
export function GrowthAreaChart({
  data,
  dataKeys = ['value'],
  colors = ['#6366f1'],
  title,
  height = 300,
  formatValue,
  showGrid = true
}) {
  return (
    <div className="w-full">
      {title && (
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
          <XAxis dataKey="year" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
          <Legend />
          {dataKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index] || colors[0]}
              fill={colors[index] || colors[0]}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Bar chart for comparison data
 */
export function ComparisonBarChart({
  data,
  dataKeys = ['value'],
  colors = ['#6366f1'],
  title,
  height = 300,
  formatValue,
  showGrid = true,
  showLegend = true
}) {
  return (
    <div className="w-full">
      {title && (
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip formatValue={formatValue} labelPrefix="" />} />
          {showLegend && <Legend />}
          {dataKeys.map((key, index) => (
            <Bar key={key} dataKey={key} fill={colors[index] || colors[0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Multi-line comparison chart
 */
export function ComparisonLineChart({
  data,
  dataKeys = ['scenario1', 'scenario2'],
  colors = ['#6366f1', '#10b981'],
  labels = ['Scenario 1', 'Scenario 2'],
  title,
  height = 300,
  formatValue
}) {
  return (
    <div className="w-full">
      {title && (
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
          <Legend />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index]}
              strokeWidth={2}
              name={labels[index] || key}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Pie chart alternative - stacked bar for breakdown
 */
export function BreakdownBarChart({
  data,
  colors = ['#6366f1', '#10b981', '#f59e0b'],
  title,
  height = 300
}) {
  return (
    <div className="w-full">
      {title && (
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" />
          <YAxis type="category" dataKey="name" stroke="#6b7280" />
          <Tooltip />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default {
  TimeSeriesLineChart,
  GrowthAreaChart,
  ComparisonBarChart,
  ComparisonLineChart,
  BreakdownBarChart,
  CustomTooltip
};
