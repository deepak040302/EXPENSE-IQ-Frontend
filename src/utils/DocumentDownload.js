export const handleDownload = async (id, transactionType, fileName) => {
  const token = localStorage.getItem("token");

  try {
    let response = "";

    if (transactionType === "Income") {
      response = await fetch(`http://localhost:8081/api/income-doc/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      response = await fetch(`http://localhost:8081/api/expense-doc/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (response.ok) {
      const base64String = await response.text();

      // Extract MIME type and Base64 content
      const mimeType = base64String.substring(5, base64String.indexOf(";"));
      const base64Content = base64String.split(",")[1];
      const fileExtension =
        "." + base64String.split(",")[0].split(";")[0].split("/")[1];

      // Convert Base64 to Blob
      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      // Create a temporary download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Set the download filename based on file type
      let extension = fileExtension;
      link.download = `${fileName}_${id}${extension}`; // Set the filename for download

      // Trigger the download by clicking the link
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true; // Success
    } else {
      console.error("Failed to fetch document");
      return false; // Fetch failed
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return false; // Error occurred
  }
};
