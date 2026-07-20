
async function main() {
  // 1. Fetch services
  const getRes = await fetch("http://localhost:3001/api/admin/services", {
    headers: {
      "X-API-Secret": "826390f2a0e02e779055acc9cfe6a644ff452d5c395e47569768de4d4c318af6",
      "X-User-Role": "ADMIN",
      "X-User-Id": "test"
    }
  });
  const services = await getRes.json();
  console.log("Got services:", services.length);

  // 2. Reorder
  const items = services.map((s: any, i: number) => ({ id: s.id, displayOrder: i }));
  
  const putRes = await fetch("http://localhost:3001/api/admin/services/reorder", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-API-Secret": "826390f2a0e02e779055acc9cfe6a644ff452d5c395e47569768de4d4c318af6",
      "X-User-Role": "ADMIN",
      "X-User-Id": "test"
    },
    body: JSON.stringify({ items })
  });

  const text = await putRes.text();
  console.log("PUT status:", putRes.status, text);
}

main();
