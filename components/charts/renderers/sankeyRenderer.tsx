'use client';

import React, { useMemo } from 'react';
import {
  ChartDataPoint,
  ChartConfig,
} from '@/components/charts/types/chart.types';

interface SankeyRendererProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  colors: string[];
  height?: number;
}

interface SankeyNode {
  id: string;
  name: string;
  column: number;
  x: number;
  y: number;
  width: number;
  height: number;
  totalIn: number;
  totalOut: number;
  total: number;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  sourceOffset: number;
  targetOffset: number;
}

export function SankeyRenderer({
  data,
  config,
  colors,
  height = 300,
}: SankeyRendererProps) {
  const chart = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    const sampleKeys = Object.keys(data[0] || {});

    const sourceKey =
      config.dimensions?.[0] ||
      sampleKeys[0] ||
      'source';

    const targetKey =
      config.dimensions?.[1] ||
      sampleKeys[1] ||
      'target';

    const valueKey =
      config.measures?.[0] ||
      sampleKeys[2] ||
      'value';

    const rawLinks = data
      .map((row) => ({
        source: String(row[sourceKey] ?? '').trim(),
        target: String(row[targetKey] ?? '').trim(),
        value: Number(row[valueKey]) || 0,
      }))
      .filter(
        (link) =>
          link.source &&
          link.target &&
          link.value > 0
      );

    if (rawLinks.length === 0) {
      return null;
    }

    const nodeNames = new Set<string>();

    rawLinks.forEach((link) => {
      nodeNames.add(link.source);
      nodeNames.add(link.target);
    });

    const nodesMap = new Map<string, SankeyNode>();

    nodeNames.forEach((name) => {
      nodesMap.set(name, {
        id: name,
        name,
        column: 0,
        x: 0,
        y: 0,
        width: 14,
        height: 20,
        totalIn: 0,
        totalOut: 0,
        total: 0,
      });
    });

    rawLinks.forEach((link) => {
      const source = nodesMap.get(link.source);
      const target = nodesMap.get(link.target);

      if (source) {
        source.totalOut += link.value;
      }

      if (target) {
        target.totalIn += link.value;
      }
    });

    nodesMap.forEach((node) => {
      node.total = Math.max(
        node.totalIn,
        node.totalOut
      );
    });

    const outgoing = new Map<string, string[]>();

    rawLinks.forEach((link) => {
      if (!outgoing.has(link.source)) {
        outgoing.set(link.source, []);
      }

      const targets = outgoing.get(link.source)!;

      if (!targets.includes(link.target)) {
        targets.push(link.target);
      }
    });

    const columns = new Map<string, number>();

    const getColumn = (
      nodeName: string,
      visiting = new Set<string>()
    ): number => {
      if (columns.has(nodeName)) {
        return columns.get(nodeName)!;
      }

      if (visiting.has(nodeName)) {
        return 0;
      }

      const nextVisiting = new Set(visiting);
      nextVisiting.add(nodeName);

      const targets = outgoing.get(nodeName) || [];

      if (targets.length === 0) {
        columns.set(nodeName, 0);
        return 0;
      }

      const maxChildColumn = Math.max(
        ...targets.map(
          (target) =>
            getColumn(target, nextVisiting)
        )
      );

      const column = maxChildColumn + 1;

      columns.set(nodeName, column);

      return column;
    };

    nodeNames.forEach((name) => {
      getColumn(name);
    });

    const maxColumn = Math.max(
      ...Array.from(columns.values())
    );

    nodesMap.forEach((node) => {
      node.column =
        maxColumn -
        (columns.get(node.id) || 0);
    });

    const nodesByColumn = new Map<
      number,
      SankeyNode[]
    >();

    nodesMap.forEach((node) => {
      if (!nodesByColumn.has(node.column)) {
        nodesByColumn.set(node.column, []);
      }

      nodesByColumn.get(node.column)!.push(node);
    });

    const width = 1000;

    const chartHeight = Math.max(
      280,
      height
    );

    const paddingX = 55;
    const paddingY = 24;
    const nodeWidth = 14;
    const nodeGap = 24;

    const columnCount = maxColumn + 1;

    const columnWidth =
      columnCount > 1
        ? (width - paddingX * 2) /
          maxColumn
        : 0;

    const availableHeight =
      chartHeight - paddingY * 2;

    const maxNodesInColumn = Math.max(
      ...Array.from(
        nodesByColumn.values()
      ).map((nodes) => nodes.length)
    );

    const minNodeHeight = 16;

    const totalValues = Array.from(
      nodesMap.values()
    ).map((node) => node.total);

    const maxNodeValue = Math.max(
      ...totalValues,
      1
    );

    const maxVisualNodeHeight = Math.min(
      110,
      availableHeight /
        Math.max(maxNodesInColumn, 1) *
        0.55
    );

    nodesByColumn.forEach(
      (nodes, column) => {
        const totalColumnValue = nodes.reduce(
          (sum, node) =>
            sum + node.total,
          0
        );

        const usableHeight =
          availableHeight -
          nodeGap *
            Math.max(nodes.length - 1, 0);

        let heights = nodes.map((node) => {
          const proportionalHeight =
            totalColumnValue > 0
              ? (node.total /
                  totalColumnValue) *
                usableHeight
              : minNodeHeight;

          return Math.max(
            minNodeHeight,
            Math.min(
              maxVisualNodeHeight,
              proportionalHeight
            )
          );
        });

        const totalHeight = heights.reduce(
          (sum, value) => sum + value,
          0
        );

        if (totalHeight > availableHeight) {
          const scale =
            availableHeight /
            totalHeight;

          heights = heights.map(
            (value) =>
              Math.max(
                minNodeHeight,
                value * scale
              )
          );
        }

        const finalHeight = heights.reduce(
          (sum, value) => sum + value,
          0
        );

        let y =
          paddingY +
          Math.max(
            0,
            (availableHeight -
              finalHeight -
              nodeGap *
                Math.max(
                  nodes.length - 1,
                  0
                )) /
              2
          );

        nodes.forEach((node, index) => {
          node.x =
            columnCount === 1
              ? width / 2 -
                nodeWidth / 2
              : paddingX +
                column *
                  columnWidth -
                nodeWidth / 2;

          node.y = y;
          node.width = nodeWidth;
          node.height = heights[index];

          y +=
            heights[index] +
            nodeGap;
        });
      }
    );

    const links: SankeyLink[] = rawLinks.map(
      (link) => ({
        ...link,
        sourceOffset: 0,
        targetOffset: 0,
      })
    );

    const sourceOffsets = new Map<
      string,
      number
    >();

    const targetOffsets = new Map<
      string,
      number
    >();

    links.forEach((link) => {
      const source = nodesMap.get(
        link.source
      );

      const target = nodesMap.get(
        link.target
      );

      if (!source || !target) {
        return;
      }

      const sourceScale =
        source.total > 0
          ? source.height / source.total
          : 0;

      const targetScale =
        target.total > 0
          ? target.height / target.total
          : 0;

      const sourceOffset =
        sourceOffsets.get(link.source) || 0;

      const targetOffset =
        targetOffsets.get(link.target) || 0;

      link.sourceOffset =
        sourceOffset +
        (link.value * sourceScale) / 2;

      link.targetOffset =
        targetOffset +
        (link.value * targetScale) / 2;

      sourceOffsets.set(
        link.source,
        sourceOffset +
          link.value * sourceScale
      );

      targetOffsets.set(
        link.target,
        targetOffset +
          link.value * targetScale
      );
    });

    return {
      nodes: Array.from(nodesMap.values()),
      links,
      width,
      height: chartHeight,
    };
  }, [data, config, height]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No data available
        </p>
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No valid links found. Need source,
          target, and value columns.
        </p>
      </div>
    );
  }

  const {
    nodes,
    links,
    width,
    height: svgHeight,
  } = chart;

  const nodeMap = new Map(
    nodes.map((node) => [
      node.id,
      node,
    ])
  );

  const maxValue = Math.max(
    ...links.map((link) => link.value),
    1
  );

  const createLinkPath = (
    link: SankeyLink
  ) => {
    const source = nodeMap.get(
      link.source
    );

    const target = nodeMap.get(
      link.target
    );

    if (!source || !target) {
      return '';
    }

    const sourceX =
      source.x + source.width;

    const targetX = target.x;

    const sourceY =
      source.y + link.sourceOffset;

    const targetY =
      target.y + link.targetOffset;

    const distance =
      Math.abs(targetX - sourceX);

    const curve =
      Math.max(
        40,
        distance * 0.45
      );

    return [
      `M ${sourceX} ${sourceY}`,
      `C ${sourceX + curve} ${sourceY},`,
      `${targetX - curve} ${targetY},`,
      `${targetX} ${targetY}`,
    ].join(' ');
  };

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${svgHeight}`}
        width="100%"
        height={height}
        preserveAspectRatio="xMidYMid meet"
        className="block w-full"
      >
        <defs>
          {links.map((link, index) => {
            const sourceIndex =
              nodes.findIndex(
                (node) =>
                  node.id === link.source
              );

            const targetIndex =
              nodes.findIndex(
                (node) =>
                  node.id === link.target
              );

            const sourceColor =
              colors[
                sourceIndex %
                  colors.length
              ];

            const targetColor =
              colors[
                targetIndex %
                  colors.length
              ];

            return (
              <linearGradient
                key={`gradient-${index}`}
                id={`sankey-gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor={
                    sourceColor
                  }
                  stopOpacity={0.32}
                />

                <stop
                  offset="100%"
                  stopColor={
                    targetColor
                  }
                  stopOpacity={0.18}
                />
              </linearGradient>
            );
          })}
        </defs>

        {/* Sankey links */}
        <g>
          {links.map(
            (link, index) => {
              const source =
                nodeMap.get(
                  link.source
                );

              const target =
                nodeMap.get(
                  link.target
                );

              if (!source || !target) {
                return null;
              }

              const scale =
                source.total > 0
                  ? source.height /
                    source.total
                  : 0;

              const strokeWidth =
                Math.max(
                  2,
                  link.value * scale
                );

              const path =
                createLinkPath(link);

              return (
                <path
                  key={`link-${index}`}
                  d={path}
                  stroke={`url(#sankey-gradient-${index})`}
                  strokeWidth={
                    strokeWidth
                  }
                  fill="none"
                  strokeLinecap="butt"
                  className="transition-opacity duration-200 hover:opacity-100"
                  opacity={0.85}
                >
                  <title>
                    {link.source} →{' '}
                    {link.target}:{' '}
                    {link.value.toLocaleString()}
                  </title>
                </path>
              );
            }
          )}
        </g>

        {/* Nodes and labels */}
        <g>
          {nodes.map(
            (node, index) => {
              const color =
                colors[
                  index %
                    colors.length
                ];

              const isLeft =
                node.column === 0;

              const isRight =
                node.column ===
                Math.max(
                  ...nodes.map(
                    (item) =>
                      item.column
                  )
                );

              /*
               * Keep labels INSIDE the SVG viewBox.
               *
               * Left/start labels:
               *   positioned near the left edge.
               *
               * Right/end labels:
               *   positioned near the right edge.
               *
               * This prevents them from being clipped
               * by the chart/container width.
               */
              const labelX = isLeft
                ? 8
                : isRight
                ? width - 8
                : node.x;

              const labelAnchor = isLeft
                ? 'start'
                : isRight
                ? 'end'
                : 'middle';

              return (
                <g
                  key={`node-${node.id}`}
                  className="group"
                >
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    rx={3}
                    fill={color}
                    className="transition-opacity duration-200 group-hover:opacity-80"
                  />

                  <text
                    x={labelX}
                    y={
                      node.y +
                      node.height / 2
                    }
                    textAnchor={
                      labelAnchor
                    }
                    dominantBaseline="middle"
                    fontSize={12}
                    fontWeight={500}
                    fill="currentColor"
                    className="fill-neutral-700 dark:fill-neutral-300 select-none"
                  >
                    {node.name.length > 18
                      ? `${node.name.slice(
                          0,
                          18
                        )}…`
                      : node.name}
                  </text>

                  <title>
                    {node.name}:{' '}
                    {node.total.toLocaleString()}
                  </title>
                </g>
              );
            }
          )}
        </g>
      </svg>
    </div>
  );
}