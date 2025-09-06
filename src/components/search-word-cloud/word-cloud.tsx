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

interface WordCloudProps {
  words: WordCloudData;
  width?: number;
  height?: number;
}

export const WordCloud: React.FC<WordCloudProps> = ({
  words,
  width = 600,
  height = 400,
}) => {
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
        .attr("width", width)
        .attr("height", height)
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

  return <svg ref={svgRef}></svg>;
};

export default WordCloud;
