// import * as React from "react";
// import TextField from "@mui/material/TextField";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import {
//   DateRangePicker as MUIDateRangePicker,
//   LocalizationProvider,
// } from "@mui/x-date-pickers-pro";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// // Define periods
// const periods = [
//   { label: "Weekly", value: "weekly" },
//   { label: "Monthly", value: "monthly" },
//   { label: "Quarterly", value: "quarterly" },
//   { label: "Yearly", value: "yearly" },
//   { label: "Custom", value: "custom" }, // <-- added Custom
// ];

// // Function to calculate range based on period
// const getDateRange = (period) => {
//   const now = new Date();
//   let startDate = new Date();
//   let endDate = new Date(); // today

//   switch (period) {
//     case "weekly":
//       startDate.setDate(now.getDate() - 6);
//       break;
//     case "monthly":
//       startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//       break;
//     case "quarterly":
//       const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
//       startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
//       break;
//     case "yearly":
//       startDate = new Date(now.getFullYear(), 0, 1);
//       break;
//     case "custom":
//       // For custom, default to last 7 days
//       startDate.setDate(now.getDate() - 6);
//       break;
//     default:
//       startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//   }

//   return [startDate, endDate];
// };

// export default function CustomDateRangePicker({
//   onChange,
//   initialPeriod = "weekly",
// }) {
//   const [selectedPeriod, setSelectedPeriod] = React.useState(initialPeriod);
//   const [value, setValue] = React.useState(getDateRange(initialPeriod));

//   // Update range when period changes
//   React.useEffect(() => {
//     const range = getDateRange(selectedPeriod);
//     setValue(range);
//     if (onChange) onChange(range);
//   }, [selectedPeriod]);

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box
//         sx={{ display: "flex", flexDirection: "column", gap: 2, width: 350 }}
//       >
//         {/* Period Buttons + Custom Dropdown */}
//         <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//           {periods
//             .filter((p) => p.value !== "custom")
//             .map((p) => (
//               <Button
//                 key={p.value}
//                 variant={selectedPeriod === p.value ? "contained" : "outlined"}
//                 size="small"
//                 onClick={() => setSelectedPeriod(p.value)}
//               >
//                 {p.label}
//               </Button>
//             ))}

//           {/* Custom Period Dropdown */}
//           <Select
//             value={selectedPeriod === "custom" ? "custom" : ""}
//             displayEmpty
//             size="small"
//             sx={{ ml: 1, minWidth: 120 }}
//             onChange={(e) => setSelectedPeriod(e.target.value)}
//           >
//             <MenuItem value="">Select Custom</MenuItem>
//             <MenuItem value="custom">Custom Date</MenuItem>
//           </Select>
//         </Box>

//         {/* Show DateRangePicker only for Custom */}
//         {selectedPeriod === "custom" && (
//           <MUIDateRangePicker
//             startText="Start Date"
//             endText="End Date"
//             value={value}
//             onChange={(newValue) => {
//               setValue(newValue);
//               if (onChange) onChange(newValue);
//             }}
//             renderInput={(startProps, endProps) => (
//               <>
//                 <TextField {...startProps} size="small" />
//                 <Box sx={{ mx: 1 }}> to </Box>
//                 <TextField {...endProps} size="small" />
//               </>
//             )}
//           />
//         )}
//       </Box>
//     </LocalizationProvider>
//   );
// }
