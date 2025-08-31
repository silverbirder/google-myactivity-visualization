import React from "react";
import type { Activity } from "../types/activity";

export const ActivityTable: React.FC<{ activities: Activity[] }> = ({
  activities,
}) => (
  <table>
    <thead>
      <tr>
        <th>header</th>
        <th>title</th>
        <th>titleUrl</th>
        <th>time</th>
        <th>products</th>
        <th>activityControls</th>
      </tr>
    </thead>
    <tbody>
      {activities.map((a, i) => (
        <tr key={i}>
          <td>{a.header}</td>
          <td>{a.title}</td>
          <td>
            <a href={a.titleUrl} target="_blank" rel="noopener noreferrer">
              {a.titleUrl}
            </a>
          </td>
          <td>{a.time}</td>
          <td>{a.products.join(", ")}</td>
          <td>{a.activityControls.join(", ")}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
