"use client";

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { ChartData } from '@/types/crm';
import { cn } from '@/lib/utils';

interface ChartDisplayProps {
  chartData: ChartData;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value} {(entry.payload as any)?.[`${entry.dataKey}_unit`] || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ChartDisplay({ chartData, className }: ChartDisplayProps) {
  const [chartType, setChartType] = useState<'combo' | 'bar' | 'line'>(
    (chartData.chartRecommendation?.primary as any) || 'bar'
  );

  // Transform data for Recharts
  const transformedData = chartData.data.labels.map((label, index) => {
    const dataPoint: any = { label };
    
    chartData.data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
      dataPoint[`${dataset.label}_unit`] = dataset.unit;
    });
    
    return dataPoint;
  });

  // Color palette
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="label" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {chartData.data.datasets
              .filter(ds => ds.type === 'bar')
              .map((dataset, index) => (
                <Bar
                  key={dataset.label}
                  dataKey={dataset.label}
                  fill={dataset.color || colors[index % colors.length]}
                />
              ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="label" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {chartData.data.datasets.map((dataset, index) => (
              <Line
                key={dataset.label}
                type="monotone"
                dataKey={dataset.label}
                stroke={dataset.color || colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        );

      case 'combo':
      default:
        return (
          <ComposedChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="label" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {chartData.data.datasets.map((dataset, index) => {
              if (dataset.type === 'bar') {
                return (
                  <Bar
                    key={dataset.label}
                    dataKey={dataset.label}
                    fill={dataset.color || colors[index % colors.length]}
                  />
                );
              } else if (dataset.type === 'area') {
                return (
                  <Area
                    key={dataset.label}
                    type="monotone"
                    dataKey={dataset.label}
                    fill={dataset.color || colors[index % colors.length]}
                    stroke={dataset.color || colors[index % colors.length]}
                  />
                );
              } else {
                return (
                  <Line
                    key={dataset.label}
                    type="monotone"
                    dataKey={dataset.label}
                    stroke={dataset.color || colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                );
              }
            })}
          </ComposedChart>
        );
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Chart Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{chartData.metadata.title}</h3>
        <p className="text-sm text-muted-foreground">{chartData.metadata.description}</p>
      </div>

      {/* Chart Type Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">View as:</span>
        <div className="flex gap-1">
          {['combo', 'bar', 'line'].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type as any)}
              className={cn(
                "px-3 py-1 text-xs rounded-md transition-colors",
                chartType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[400px] bg-card rounded-lg border p-4">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      {chartData.statistics?.summary && chartData.statistics.summary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {chartData.statistics.summary.slice(0, 6).map((stat, index) => (
            <div key={index} className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{stat.metric}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-lg font-semibold">
                  {stat.value.toLocaleString()} {stat.unit}
                </p>
                {stat.change && (
                  <span
                    className={cn(
                      "text-xs font-medium",
                      stat.change.direction === 'up' ? "text-green-600" : 
                      stat.change.direction === 'down' ? "text-red-600" : 
                      "text-gray-600"
                    )}
                  >
                    {stat.change.direction === 'up' ? '↑' : 
                     stat.change.direction === 'down' ? '↓' : '→'}
                    {Math.abs(stat.change.percentage).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Metadata Footer */}
      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        {chartData.metadata.analysisId && (
          <p>Analysis ID: {chartData.metadata.analysisId}</p>
        )}
        {chartData.metadata.queryInfo && (
          <>
            {chartData.metadata.queryInfo.database && (
              <p>
                Data source: {chartData.metadata.queryInfo.database}
                {chartData.metadata.queryInfo.table && ` - ${chartData.metadata.queryInfo.table}`}
              </p>
            )}
            {chartData.metadata.queryInfo.rowCount !== undefined && (
              <p>Total rows: {chartData.metadata.queryInfo.rowCount.toLocaleString()}</p>
            )}
          </>
        )}
        {chartData.metadata.timestamp && (
          <p>Generated: {new Date(chartData.metadata.timestamp).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}