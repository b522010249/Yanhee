import React from "react";

const ComponentToPrint = React.forwardRef((props, ref) => {
  const { employees } = props;
    const style = {
        // Your CSS styles here
        
        backgroundColor: "lightblue",
        fontSize: "16px",
      };
      const printStyles = `
      @media print {
        /* Set the page size here */
        @page {
            size: 2in 1in;
          }
  
        /* Reset some default styles for better print formatting */
        body {
          margin: 0;
        }

  
        /* Add other print-specific styles as needed */
      }
    `;    
  return (
    
    <div ref={ref} style={style}>
        <style>{printStyles}</style>
        
    </div>
  );
});

export default ComponentToPrint;

