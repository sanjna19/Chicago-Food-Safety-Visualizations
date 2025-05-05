// main.js

// --- Linked View 1: Corrected ---

const linkedview1 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "vconcat": [
      {
        "width": 700,
        "height": 200,
        "data": {"url": "data/inspection_data_for_zip.csv"},
        "mark": "line",
        "selection": {
          "brush": {"type": "interval", "encodings": ["x"]}
        },
        "encoding": {
          "x": {"field": "Inspection Date", "type": "temporal", "title": "Inspection Date"},
          "y": {"aggregate": "mean", "field": "Failed", "type": "quantitative", "title": "Failure Rate"},
          "tooltip": [
            {"field": "Inspection Date", "type": "temporal"},
            {"field": "Failed", "type": "quantitative", "aggregate": "mean", "format": ".2%"}
          ]
        },
        "title": "Failure Rate Over Time (Brush to Filter ZIP Codes)"
      },
      {
        "width": 700,
        "height": 400,
        "data": {"url": "data/inspection_data_for_zip.csv"},
        "transform": [
          {"filter": {"selection": "brush"}},
          {
            "aggregate": [{"op": "mean", "field": "Failed", "as": "Failure Rate"}],
            "groupby": ["Zip"]
          },
          {
            "window": [{"op": "rank", "as": "rank"}],
            "sort": [{"field": "Failure Rate", "order": "descending"}]
          },
          {"filter": "datum.rank <= 30"}
        ],
        "mark": "bar",
        "encoding": {
          "y": {"field": "Zip", "type": "nominal", "sort": "-x", "title": "ZIP Code"},
          "x": {"field": "Failure Rate", "type": "quantitative", "title": "Failure Rate"},
          "color": {"field": "Failure Rate", "type": "quantitative", "scale": {"scheme": "reds"}},
          "tooltip": [
            {"field": "Zip", "type": "nominal"},
            {"field": "Failure Rate", "type": "quantitative", "format": ".2%"}
          ]
        },
        "title": "Top 30 ZIP Codes by Failure Rate (Filtered by Brush)"
      }
    ]
  };
  
  vegaEmbed("#linkedview1", linkedview1);
  
  
// --- Linked View 2: Final Version (Single Facility Click Only) ---

const linkedview2 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "vconcat": [
      {
        "width": 400,
        "height": 400,
        "data": {"url": "data/facility_type_results.csv"},
        "transform": [
          {
            "aggregate": [{"op": "count", "as": "Count"}],
            "groupby": ["Facility Type"]
          },
          {
            "window": [{"op": "rank", "as": "rank"}],
            "sort": [{"field": "Count", "order": "descending"}]
          },
          {"filter": "datum.rank <= 10"}
        ],
        "selection": {
          "facility_select": {
            "type": "single",
            "fields": ["Facility Type"],
            "on": "click",
            "clear": false,                     // 🚨 Important
            "init": {"Facility Type": "RESTAURANT"} // 🚨 Important
          }
        },
        "mark": "bar",
        "encoding": {
          "y": {"field": "Facility Type", "type": "nominal", "sort": "-x"},
          "x": {"field": "Count", "type": "quantitative"},
          "color": {
            "condition": {"selection": "facility_select", "value": "orange"},
            "value": "lightgray"
          },
          "tooltip": [
            {"field": "Facility Type", "type": "nominal"},
            {"field": "Count", "type": "quantitative"}
          ]
        },
        "title": "Top 10 Facility Types (Click to Filter)"
      },
  
      {
        "width": 700,
        "height": 400,
        "data": {"url": "data/monthly_facility_counts.csv"},
        "transform": [
          {"filter": {"selection": "facility_select"}}
        ],
        "mark": {"type": "area", "interpolate": "monotone", "opacity": 0.6},
        "encoding": {
          "x": {"field": "Month", "type": "temporal"},
          "y": {"field": "Inspection Count", "type": "quantitative"},
          "tooltip": [
            {"field": "Month", "type": "temporal"},
            {"field": "Inspection Count", "type": "quantitative"}
          ]
        },
        "title": "Monthly Inspection Volume (Filtered by Facility Type)"
      }
    ]
  };
  
  vegaEmbed("#linkedview2", linkedview2);
  
// --- Corrected Linked View 3: Strip Plot + Failure Rate Over Time ---

const linkedview3 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "vconcat": [
      {
        "width": 500,
        "height": 250,
        "data": {"url": "data/risk_level_failure.csv"},
        "transform": [
          {"window": [{"op": "row_number", "as": "row_number"}]},
          {"filter": "datum.row_number <= 1000"} // Optional: Limit to first 1000 records to avoid clutter
        ],
        "selection": {
          "risk_select": {
            "type": "single",
            "fields": ["Risk"],
            "on": "click",
            "clear": false,
            "init": {"Risk": "Risk 1"}
          }
        },
        "mark": {"type": "circle", "size": 30, "opacity": 0.4},
        "encoding": {
          "x": {"field": "Risk", "type": "nominal", "sort": ["Risk 1", "Risk 2", "Risk 3"]},
          "y": {"field": "Failed", "type": "quantitative", "scale": {"domain": [-0.1, 1.1]}, "title": "Failure (0=Pass, 1=Fail)"},
          "color": {
            "condition": {"selection": "risk_select", "field": "Risk", "type": "nominal"},
            "value": "lightgray"
          },
          "tooltip": [{"field": "Risk", "type": "nominal"}, {"field": "Failed", "type": "quantitative"}]
        },
        "title": "Click a Risk Level"
      },
  
      {
        "width": 700,
        "height": 400,
        "data": {"url": "data/risk_level_failure.csv"},
        "transform": [
          {"filter": {"selection": "risk_select"}},
          {
            "aggregate": [
              {"op": "mean", "field": "Failed", "as": "Failure Rate"}
            ],
            "groupby": ["Month"]
          }
        ],
        "mark": {"type": "line", "interpolate": "monotone"},
        "encoding": {
          "x": {"field": "Month", "type": "temporal"},
          "y": {"field": "Failure Rate", "type": "quantitative"},
          "tooltip": [
            {"field": "Month", "type": "temporal"},
            {"field": "Failure Rate", "type": "quantitative", "format": ".2%"}
          ],
          "color": {"value": "red"}
        },
        "title": "Failure Rate Over Time (Filtered by Risk Level)"
      }
    ]
  };
  
  vegaEmbed("#linkedview3", linkedview3);
       

  
  
  // --- Linked View 4: Risk Radio Button + Top Violation Codes ---

  const linkedview4 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  
    // Define the shared risk selection param
    "params": [
      {
        "name": "risk_select",
        "bind": {
          "input": "radio",
          "options": ["Risk 1", "Risk 2", "Risk 3"],
          "name": "Select Risk Level: "
        },
        "value": "Risk 1"
      }
    ],
  
    "vconcat": [
      // --- Top Strip Plot (Clickable Risk Selection) ---
      {
        "width": 400,
        "height": 120,
        "data": {
          "values": [
            {"Risk": "Risk 1"},
            {"Risk": "Risk 2"},
            {"Risk": "Risk 3"}
          ]
        },
        "mark": {"type": "circle", "size": 200},
        "encoding": {
          "x": {
            "field": "Risk",
            "type": "nominal",
            "sort": ["Risk 1", "Risk 2", "Risk 3"],
            "axis": {"title": "Risk Level"}
          },
          "y": {
            "value": 0
          },
          "color": {
            "condition": {
              "test": "datum.Risk === risk_select",
              "value": "orange"
            },
            "value": "lightgray"
          },
          "tooltip": [{"field": "Risk", "type": "nominal"}]
        },
        "title": "Click to Select Risk Level"
      },
  
      // --- Bottom Bar Chart (Top 20 Violations for Selected Risk) ---
      {
        "width": 700,
        "height": 400,
        "data": {"url": "data/violation_by_risk.csv"},
        "transform": [
          {"filter": "datum.Risk === risk_select"},
          {
            "window": [{"op": "rank", "as": "rank"}],
            "sort": [{"field": "Count", "order": "descending"}]
          },
          {"filter": "datum.rank <= 20"}
        ],
        "mark": "bar",
        "encoding": {
          "y": {
            "field": "Violation Codes",
            "type": "nominal",
            "sort": "-x",
            "axis": {
              "title": "Violation Code",
              "labelFontSize": 12
            }
          },
          "x": {
            "field": "Count",
            "type": "quantitative",
            "axis": {
              "title": "Violation Count",
              "tickMinStep": 200   // 👈 Smaller tick steps for better granularity
            }
          },
          "color": {
            "field": "Count",
            "type": "quantitative",
            "scale": {"scheme": "blues"}
          },
          "tooltip": [
            {"field": "Violation Codes", "type": "nominal"},
            {"field": "Count", "type": "quantitative"}
          ]
        },
        "title": "Top 20 Violation Codes for Selected Risk Level"
      }
    ]
  };
  
  vegaEmbed("#linkedview4", linkedview4);
        
  // --- Linked View 5: Dropdown Year Filter ---

  const linkedview5 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  
    "params": [
      {
        "name": "year_select",
        "bind": {
          "input": "select",
          "options": ["2019", "2020", "2021", "2022", "2023", "2024"],
          "name": "Select Year: "
        },
        "value": "2024"
      }
    ],
  
    "vconcat": [
      // --- Top Bar Chart (Facility Type Counts for Selected Year) ---
      {
        "width": 700,
        "height": 400,
        "data": {"url": "data/inspection_data.csv"},
        "transform": [
          {
            "filter": "year(datum['Inspection Date']) == year_select"
          },
          {
            "aggregate": [{"op": "count", "as": "Inspection Count"}],
            "groupby": ["Facility Type"]
          },
          {
            "window": [{"op": "rank", "as": "rank"}],
            "sort": [{"field": "Inspection Count", "order": "descending"}]
          },
          {"filter": "datum.rank <= 10"}
        ],
        "mark": "bar",
        "encoding": {
          "y": {"field": "Facility Type", "type": "nominal", "sort": "-x"},
          "x": {"field": "Inspection Count", "type": "quantitative"},
          "tooltip": [
            {"field": "Facility Type", "type": "nominal"},
            {"field": "Inspection Count", "type": "quantitative"}
          ]
        },
        "title": "Top 10 Facility Types (Filtered by Selected Year)"
      },
  
      // --- Bottom Line Chart (Failure Rate Over Time for Selected Year) ---
      {
        "width": 700,
        "height": 400,
        "data": {"url": "data/inspection_data.csv"},
        "transform": [
          {
            "filter": "year(datum['Inspection Date']) == year_select"
          },
          {
            "timeUnit": "yearmonth",
            "field": "Inspection Date",
            "as": "Month"
          },
          {
            "aggregate": [
              {"op": "mean", "field": "Failed", "as": "Failure Rate"}
            ],
            "groupby": ["Month"]
          }
        ],
        "mark": {
          "type": "line",
          "color": "red",
          "interpolate": "monotone"
        },
        "encoding": {
          "x": {
            "field": "Month",
            "type": "temporal",
            "axis": {"title": "Month"}
          },
          "y": {
            "field": "Failure Rate",
            "type": "quantitative",
            "axis": {"title": "Average Failure Rate"}
          },
          "tooltip": [
            {"field": "Month", "type": "temporal"},
            {"field": "Failure Rate", "type": "quantitative", "format": ".2%"}
          ]
        },
        "title": "Failure Rate Over Time (Filtered by Selected Year)"
      }
    ]
  };
  
  vegaEmbed("#linkedview5", linkedview5);

  // const spatialSpec = {
  //   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  //   "vconcat": [
  //     // --- Choropleth Map ---
  //     {
  //       "width": 400,
  //       "height": 400,
  //       "data": {
  //         "url": "data/Boundaries - ZIP Codes_20250402.geojson",
  //         "format": {"type": "geojson"}
  //       },
  //       "layer": [
  //         {
  //           "mark": {"type": "geoshape"},
  //           "encoding": {
  //             "color": {
  //               "field": "properties.zip",
  //               "type": "nominal",
  //               "legend": null
  //             }
  //           }
  //         },
  //         {
  //           "transform": [
  //             {
  //               "lookup": "properties.zip",
  //               "from": {
  //                 "data": {"url": "data/zip_failure_rates.csv"},
  //                 "key": "Zip",
  //                 "fields": ["FailureRate"]
  //               }
  //             }
  //           ],
  //           "mark": {"type": "geoshape"},
  //           "encoding": {
  //             "color": {
  //               "field": "FailureRate",
  //               "type": "quantitative",
  //               "scale": {"scheme": "blues"},
  //               "title": "Failure Rate"
  //             },
  //             "tooltip": [
  //               {"field": "properties.zip", "type": "nominal", "title": "ZIP"},
  //               {"field": "FailureRate", "type": "quantitative", "format": ".2%", "title": "Failure Rate"}
  //             ]
  //           }
  //         }
  //       ],
  //       "title": "Failure Rate by ZIP Code"
  //     },
  
  //     // --- Strip Plot ---
  //     {
  //       "width": 400,
  //       "height": 250,
  //       "data": {"url": "data/inspection_vis4.csv"},
  //       "mark": {"type": "circle", "opacity": 0.4, "size": 12},
  //       "selection": {
  //         "risk_select": {"type": "single", "fields": ["Risk"], "on": "click", "init": {"Risk": "Risk 1"}},
  //         "zip_select": {"type": "single", "fields": ["Zip"], "on": "click"}
  //       },
  //       "encoding": {
  //         "x": {"field": "Risk", "type": "nominal", "sort": ["Risk 1", "Risk 2", "Risk 3"]},
  //         "y": {"field": "FailedJitter", "type": "quantitative"},
  //         "color": {
  //           "condition": {"selection": "risk_select", "field": "Risk", "type": "nominal"},
  //           "value": "lightgray"
  //         },
  //         "tooltip": [
  //           {"field": "Risk", "type": "nominal"},
  //           {"field": "Results", "type": "nominal"},
  //           {"field": "Zip", "type": "nominal"}
  //         ]
  //       },
  //       "transform": [
  //         {"filter": {"selection": "zip_select"}}
  //       ],
  //       "title": "Inspection Outcomes by Risk"
  //     },
  
  //     // --- Line Chart: Failure Rate Over Time ---
  //     {
  //       "width": 550,
  //       "height": 400,
  //       "data": {"url": "data/inspection_vis4.csv"},
  //       "transform": [
  //         {"filter": {"selection": "risk_select"}},
  //         {"filter": {"selection": "zip_select"}},
  //         {
  //           "aggregate": [{"op": "mean", "field": "Failed", "as": "FailureRate"}],
  //           "groupby": ["Month"]
  //         }
  //       ],
  //       "mark": {"type": "line", "color": "red"},
  //       "encoding": {
  //         "x": {"field": "Month", "type": "temporal", "title": "Month"},
  //         "y": {"field": "FailureRate", "type": "quantitative", "title": "Failure Rate"},
  //         "tooltip": [
  //           {"field": "Month", "type": "temporal"},
  //           {"field": "FailureRate", "type": "quantitative", "format": ".2%"}
  //         ]
  //       },
  //       "title": "Failure Rate Over Time (Filtered)"
  //     }
  //   ]
  // };
  
  // vegaEmbed("#linkedview6", linkedview6);

  console.log("✅ main.js loaded and running");

  const view6 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 500,
    "height": 1000,
    "title": {
      "text": "Chicago Food Inspection Failure Rate by ZIP Code (2019–2024)",
      "anchor": "start",
      "fontSize": 18,
      "color": "#333"
    },
    "layer": [
      {
        "data": {
          "url": "data/chicago_boundary.json",
          "format": { "type": "json", "property": "features" }
        },
        "mark": {
          "type": "geoshape",
          "fill": "#f0f0f0",
          "stroke": "#ccc"
        },
        "projection": { "type": "mercator" }
      },
      {
        "data": {
          "url": "data/minimized_choropleth.json",
          "format": { "type": "json", "property": "features" }
        },
        "transform": [
          { "filter": "datum.properties.FailureRate != null" }
        ],
        "mark": "geoshape",
        "projection": { "type": "mercator" },
        "encoding": {
          "color": {
            "field": "properties.FailureRate",
            "type": "quantitative",
            "title": "Failure Rate",
            "scale": {
              //"scheme": "viridis"
              "scheme": "yelloworangered"
              //"domain": [0, 0.35]
            }
          },
          "tooltip": [
            { "field": "properties.zip", "type": "nominal", "title": "ZIP Code" },
            { "field": "properties.FailureRate", "type": "quantitative", "title": "Failure Rate" }
          ]
        }
      }
    ]
  };
  
  vegaEmbed('#view6', view6);  
  
  console.log("✅ main.js loaded and running");


// -------------Linked View 7----------------

// -------------------------
// Heatmap: Quarter vs Risk (Selection Origin)
// -------------------------
const heatmap = {
  width: 700,
  height: 350,
  data: { url: "data/heatmap_data.csv" },
  mark: "rect",

  selection: {
    timeSelect: {
      type: "multi",
      fields: ["Month"]
    }
  },

  encoding: {
    x: {
      field: "Month",
      type: "ordinal",
      title: "Quarter",
      axis: {
        labelAngle: -45,
        labelFontSize: 10,
        labelOverlap: "parity"  // Hides every other label if space is tight
      }
    },
    y: {
      field: "Risk",
      type: "nominal",
      title: "Risk Level",
      sort: ["Risk 1 (High)", "Risk 2 (Medium)", "Risk 3 (Low)"]
    },
    color: {
      field: "Failure Rate",
      type: "quantitative",
      scale: { scheme: "viridis" },  // perceptual and readable
      title: "Heatmap Failure Rate (%)",
      legend: {
        orient: "right",
        titleFontSize: 12,
        labelFontSize: 10
      }
    },
    tooltip: [
      { field: "Month" },
      { field: "Risk" },
      { field: "Failure Rate", format: ".2f" }
    ],
    opacity: {
      condition: { selection: "timeSelect", value: 1 },
      value: 0.3
    }
  }
};


// -------------------------
// Treemap
// -------------------------
const treemap = {
  width: 700,
  height: 300,
  data: { url: "data/treemap_data_custom.csv" },
  mark: "rect",

  selection: {
    facilitySelect: {
      type: "multi",
      fields: ["Facility Type"]
    }
  },

  transform: [
    { filter: { selection: "timeSelect" } },
    {
      window: [{ op: "rank", as: "rank" }],
      sort: [{ field: "total_inspections", order: "descending" }],
      groupby: ["Month", "Risk"]
    },
    { filter: "datum.rank <= 15" }
  ],

  encoding: {
    x: {
      field: "Facility Type",
      type: "nominal",
      title: "Facility Type",
      axis: {
        labelAngle: -45,
        labelFontSize: 9
      },
      sort: "-y"
    },
    y: {
      field: "total_inspections",
      type: "quantitative",
      title: "Total Inspections"
    },
    color: {
      value: "#FFA500"  // constant orange shade
    },
    opacity: {
      field: "Treemap Failure Rate",
      type: "quantitative",
      title: "Treemap Failure Rate (%)"
    },
    tooltip: [
      { field: "Facility Type" },
      { field: "total_inspections", title: "Inspections" },
      { field: "Treemap Failure Rate", format: ".2f" }
    ],
    opacity: {
      condition: { selection: "facilitySelect", value: 1 },
      value: 0.3
    }
  }
};




// -------------------------
// Violin Plot (Boxplot): Risk vs Violation Count
// -------------------------
const violin = {
  width: 700,
  height: 300,
  data: { url: "data/violin_data.csv" },
  transform: [
    { filter: { selection: "timeSelect" } },
    { filter: { selection: "facilitySelect" } }
  ],
  layer: [
    // 1. Transparent bars for selection
    {
      mark: {
        type: "bar",
        opacity: 0,
        tooltip: true,
        cursor: "pointer"
      },
      selection: {
        inspectionSelect: {
          type: "multi",
          fields: ["Inspection Type"]
        }
      },
      encoding: {
        x: {
          field: "Inspection Type",
          type: "nominal",
          axis: { labelAngle: -45, labelFontSize: 10 },
          title: "Inspection Type"
        },
        y: {
          aggregate: "max",
          field: "Violation Count"
        },
        tooltip: [{ field: "Inspection Type" }]
      }
    },

    // 2. Boxplot layer filtered by inspection selection
    {
      transform: [
        { filter: { selection: "inspectionSelect" } }
      ],
      mark: "boxplot",
      encoding: {
        x: {
          field: "Inspection Type",
          type: "nominal",
          title: "Inspection Type",
          axis: { labelAngle: -45, labelFontSize: 10 }
        },
        y: {
          field: "Violation Count",
          type: "quantitative",
          title: "Number of Violations"
        },
        color: {
          field: "Facility Type",
          type: "nominal",
          legend: null // optional: remove clutter
        },
        tooltip: [
          { field: "Inspection Type" },
          { field: "Violation Count" },
          { field: "Facility Type" }
        ]
      }
    }
  ]
};


// -------------------------
// Combine All Views
// -------------------------
const fullSpec = {
  vconcat: [
    heatmap,
    treemap,
    violin
  ],
  resolve: {
    scale: {
      color: "independent"
    }
  }
};

vegaEmbed("#view", fullSpec);




  document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', () => {
      const modal = document.getElementById('modal');
      const target = document.getElementById('modal-content-target');
  
      // Clear previous modal content
      target.innerHTML = '';
  
      // Get the ID of the clicked chart div (e.g., 'linkedview1')
      const originalId = item.id;
  
      // Clone Vega spec from your JavaScript (you must expose it)
      let spec;
  
      switch (originalId) {
        case 'view6':
          spec = view6;
          break;
        case 'linkedview1':
          spec = linkedview1;
          break;
        case 'linkedview2':
          spec = linkedview2;
          break;
        case 'linkedview5':
          spec = linkedview5;
          break; 
        case 'linkedview4':
          spec = linkedview4;
          break; 
        case 'view':
          spec = fullSpec;
          break;
        case 'linked_bubble_parallel':
          spec = {
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            vconcat: [bubble, parallel],
            config: {
              view: { stroke: null },
              axis: { grid: true }
            }
          };
          break;
        // Add other cases as needed
        default:
          spec = null;
      }
  
      if (spec) {
        // Re-embed Vega spec inside modal
        vegaEmbed(target, spec);
        modal.style.display = 'flex';
      }
    });
  });
  
  // Close modal
  function closeModal() {
    document.getElementById('modal').style.display = 'none';
  }
  


  const bubble = {
    width: 600,
    height: 400,
    data: { url: 'data/score_violation_parallel.csv' },
    selection: {
      legend_select: {
        type: 'multi',
        fields: ['Facility Type'],
        bind: 'legend'
      }
    },
    mark: 'point',
    encoding: {
      x: {
        field: 'Facility Type',
        type: 'nominal',
        axis: { title: 'Facility Type', labelAngle: -30 }
      },
      y: {
        field: 'Violation Severity Score',
        type: 'quantitative',
        axis: { title: 'Avg Violation Severity' }
      },
      size: {
        field: 'Violation Count',
        type: 'quantitative',
        legend: { title: 'Avg Violation Count' }
      },
      color: {
        field: 'Facility Type',
        type: 'nominal',
        legend: { title: 'Facility Type' }
      },
      opacity: {
        condition: [
          { selection: 'legend_select', value: 1 },
          { selection: 'brush', value: 1 }
        ],
        value: 0.05
      }
    }
  };
  
  const parallel = {
    width: 600,
    height: 300,
    data: { url: 'data/score_violation_parallel.csv' },
    transform: [
      { fold: ['Score_norm', 'Count_norm', 'Severity_norm'], as: ['Metric', 'Value'] }
    ],
    selection: {
      brush: { type: 'interval', encodings: ['y'] },
      legend_select: {
        type: 'multi',
        fields: ['Facility Type'],
        bind: 'legend'
      }
    },
    mark: 'line',
    encoding: {
      x: { field: 'Metric', type: 'ordinal', axis: { title: null } },
      y: { field: 'Value', type: 'quantitative' },
      color: { field: 'Facility Type', type: 'nominal', legend: null },
      detail: { field: 'Facility Type' },
      opacity: {
        condition: { selection: 'legend_select', value: 1 },
        value: 0.05
      }
    }
  };
  
  vegaEmbed('#linked_bubble_parallel', {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    vconcat: [bubble, parallel],
    config: {
      view: { stroke: null },
      axis: { grid: true }
    }
  });
  