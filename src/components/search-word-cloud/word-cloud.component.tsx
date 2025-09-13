"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

type CloudWord = {
  text: string;
  size: number;
  x?: number;
  y?: number;
  rotate?: number;
  font?: string;
  style?: string;
  weight?: string;
  width?: number;
  height?: number;
  padding?: number;
};

export type WordCloudData = { text: string; value: number }[];

type Props = {
  words: WordCloudData;
  width?: number;
  height?: number;
};

export const WordCloudComponent = ({
  words,
  width = 600,
  height = 400,
}: Props) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (!words.length) return;
    const layout = cloud()
      .size([width, height])
      .words(words.map((d) => ({ text: d.text, size: 10 + d.value * 2 })))
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 0 : 90))
      .font("Impact")
      .fontSize((d) => d.size ?? 0)
      .on("end", draw);
    layout.start();

    function draw(words: CloudWord[]) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      svg
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-family", "Impact")
        .style("font-size", (d: CloudWord) => `${d.size}px`)
        .style(
          "fill",
          (_: CloudWord, i: number) => d3.schemeCategory10[i % 10] ?? "#888",
        )
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          (d: CloudWord) => `translate(${d.x},${d.y})rotate(${d.rotate})`,
        )
        .text((d: CloudWord) => d.text);
    }
  }, [words, width, height]);

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "200px" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
    </div>
  );
};
