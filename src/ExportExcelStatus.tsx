import React from "react";
import { Button } from "react-native-paper";
import * as XLSX from "xlsx";

interface HealthCheckCount {
  employeeId: string;
  employeeName: string;
  order: number;
  noCheckup: boolean;
  checks: { [healthCheckTypeId: string]: boolean };
}

interface ExportToExcelButtonProps {
  healthCheckCounts: HealthCheckCount[];
}

const ExportExcelStatus: React.FC<ExportToExcelButtonProps> = ({
  healthCheckCounts,
}) => {
  const sortedEmployees = healthCheckCounts.sort((a, b) => {
    // Convert checks object values to an array
    const checksA = Object.values(a.checks);
    const checksB = Object.values(b.checks);

    // Compare arrays of checks to prioritize "false" values first
    for (let i = 0; i < checksA.length; i++) {
      if (checksA[i] !== checksB[i]) {
        return checksA[i] ? 1 : -1;
      }
    }

    // If all checks are the same, prioritize by order
    return a.order - b.order;
  });
  const exportToExcel = () => {
    let data = sortedEmployees.map(({ order, employeeName, noCheckup, checks, status }) => {
        const formattedChecks = {};
        let healthCheckStatus = "";
    
        for (const key in checks) {
            if (checks.hasOwnProperty(key)) {
                formattedChecks[key] =
                    checks[key] === null
                        ? "ยกเลิก"
                        : checks[key]
                            ? "ตรวจแล้ว"
                            : "ยังไม่ได้ตรวจ";
            }
        }
    
        if (status === "Cancel") {
            healthCheckStatus = "ยกเลิกการตรวจ";
        } else {
            const pendingCheckups = Object.keys(checks)
                .filter(check => !checks[check] && checks[check] !== null) // Filter out cancelled checkups
                .map(check => `${check}`) // Map pending checkups to the desired format
                .join(", ");
            const cancelledCheckups = Object.keys(checks)
                .filter(check => checks[check] === null) // Filter only cancelled checkups
                .map(check => `${check}`) // Map cancelled checkups to the desired format
                .join(", ");
    
            if (cancelledCheckups) {
                healthCheckStatus += "ยกเลิก:" + cancelledCheckups;
            }
            if (pendingCheckups) {
                healthCheckStatus += (cancelledCheckups ? ", " : "") + "ปฏิเสธ:" + pendingCheckups;
            }
        }
    
        return {
            ลำดับ: order,
            "ชื่อ-นามสกุล": employeeName,
            หมายเหตุ: healthCheckStatus,
            ...formattedChecks,
        };
    });
    
    const checkupCounts = {};
    
    sortedEmployees.forEach(({ checks }) => {
        Object.entries(checks).forEach(([key, value]) => {
            const formattedCheck = value === null ? "ยกเลิก" : value ? "ตรวจแล้ว" : "ยังไม่ได้ตรวจ";
            checkupCounts[key] = (checkupCounts[key] || 0) + (formattedCheck === "ตรวจแล้ว" ? 1 : 0);
        });
    });
    
    console.log("Checkup Counts:", checkupCounts);
    console.log(data);
    
    
    
    
    
    const totalsRow = {
        ลำดับ: "Total", // You can change this value as per your requirement
        "ชื่อ-นามสกุล": "", // Leave it empty for total row
        หมายเหตุ: "", // Leave it empty for total row
      };
    
      Object.entries(checkupCounts).forEach(([key, value]) => {
        totalsRow[key] = value;
      });
    
      data = [...data, totalsRow]; 
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Status2');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Status2.xlsx');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Button mode="contained" onPress={exportToExcel}>
      Export to Excel
    </Button>
  );
};

export default ExportExcelStatus;
