
document.addEventListener('DOMContentLoaded', async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='));
  if (!token) {
    window.location.href = '/auth.html';
    return;
  }
  await loadExpenses();
  await loadSummary();
});


document.getElementById('expenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const expense = {
    amount: parseFloat(document.getElementById('amount').value),
    category: document.getElementById('category').value,
    date: document.getElementById('date').value,
    description: document.getElementById('description').value
  };

  await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense)
  });

  loadExpenses();
  loadSummary();
  e.target.reset();
});

async function loadExpenses() {
  const response = await fetch('/api/expenses');
  const expenses = await response.json();
  const table = document.getElementById('expenseList');
  table.innerHTML = expenses.map(expense => `
    <tr>
      <td>$${expense.amount.toFixed(2)}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td>${expense.description || '-'}</td>
    </tr>
  `).join('');
}


let chart;

async function loadSummary() {
  const response = await fetch('/api/summary');
  const summary = await response.json();

  const ctx = document.getElementById('summaryChart').getContext('2d');
  
  if (chart) chart.destroy(); // Clear old chart

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: summary.map(item => item.category),
      datasets: [{
        data: summary.map(item => item.total),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ]
      }]
    }
  });
}