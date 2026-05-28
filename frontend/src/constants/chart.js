export const chartColors = {
  delivered: '#0F7B6C',
  shipped: '#2383E2',
  processing: '#D9730D',
  canceled: '#E03E3E',
  invoiced: '#9065B0',
  approved: '#787774',
  created: '#787774',
  unavailable: '#787774',
  default: '#9B9A97',

  credit_card: '#2383E2',
  boleto: '#D9730D',
  voucher: '#9065B0',
  debit_card: '#0F7B6C',
  not_defined: '#9B9A97',

  revenue: '#2383E2',
  revenueArea: 'rgba(35, 131, 226, 0.08)',
}

export const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: { family: 'Inter', size: 12 },
        color: '#787774',
        boxWidth: 12,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E3E2E0',
      borderWidth: 1,
      titleColor: '#37352F',
      bodyColor: '#787774',
      padding: 10,
      titleFont: { family: 'Inter', size: 13, weight: '500' },
      bodyFont: { family: 'Inter', size: 12 },
    },
  },
  scales: {
    x: {
      ticks: { color: '#787774', font: { family: 'Inter', size: 12 } },
      grid: { color: '#F7F6F3' },
    },
    y: {
      ticks: { color: '#787774', font: { family: 'Inter', size: 12 } },
      grid: { color: '#F7F6F3' },
    },
  },
}

export const statusLabels = {
  delivered: 'Delivered',
  shipped: 'Shipped',
  processing: 'Processing',
  canceled: 'Canceled',
  invoiced: 'Invoiced',
  approved: 'Approved',
  created: 'Created',
  unavailable: 'Unavailable',
}

export const paymentLabels = {
  credit_card: 'Cartão de crédito',
  boleto: 'Boleto',
  voucher: 'Voucher',
  debit_card: 'Cartão de débito',
  not_defined: 'Não definido',
}
