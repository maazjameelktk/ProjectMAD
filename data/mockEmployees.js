export const generateMockEmployees = () => {
  const employees = [];
  const ranks = [
    { title: 'Lt/Capt/Maj', fee: 500 },
    { title: 'Lt Col/Col', fee: 1000 },
    { title: 'Brig', fee: 1200 },
    { title: 'Maj Gen', fee: 1500 },
    { title: 'Lt Gen', fee: 2000 },
    { title: 'Gen', fee: 2000 },
  ];
  
  const statuses = ['Serving', 'Retired'];
  const cities = ['Rawalpindi', 'Islamabad', 'Lahore', 'Karachi', 'Quetta', 'Peshawar'];
  
  for (let i = 1; i <= 500; i++) {
    const rankIndex = Math.floor(Math.random() * ranks.length);
    const rank = ranks[rankIndex];
    const joinYear = 2000 + Math.floor(Math.random() * 25);
    const joinDate = new Date(joinYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    
    let leaveDate = null;
    if (Math.random() > 0.7) {
      const leaveYear = joinYear + Math.floor(Math.random() * (2024 - joinYear));
      leaveDate = new Date(leaveYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    }
    
    const endDate = leaveDate || new Date();
    const membershipPeriod = Math.floor((endDate - joinDate) / (1000 * 60 * 60 * 24 * 365.25));
    
    // Calculate fees based on rank
    const quarterlyFee = rank.fee * 3;
    const sixMonthFee = rank.fee * 6;
    const nineMonthFee = rank.fee * 9;
    const yearlyFee = rank.fee * 12;
    
    // Simulate fee payments
    const registrationFee = { paid: Math.random() > 0.3, amount: 600 };
    const quarterlyFeeData = { paid: Math.random() > 0.4, amount: quarterlyFee };
    const sixMonthFeeData = { paid: Math.random() > 0.5, amount: sixMonthFee };
    const nineMonthFeeData = { paid: Math.random() > 0.6, amount: nineMonthFee };
    const yearlyFeeData = { paid: Math.random() > 0.7, amount: yearlyFee };
    
    let totalPaid = 0;
    if (registrationFee.paid) totalPaid += registrationFee.amount;
    if (quarterlyFeeData.paid) totalPaid += quarterlyFeeData.amount;
    if (sixMonthFeeData.paid) totalPaid += sixMonthFeeData.amount;
    if (nineMonthFeeData.paid) totalPaid += nineMonthFeeData.amount;
    if (yearlyFeeData.paid) totalPaid += yearlyFeeData.amount;
    
    const totalFee = 600 + quarterlyFee + sixMonthFee + nineMonthFee + yearlyFee;
    const feeRemaining = totalFee - totalPaid;
    
    const yearsSinceJoin = new Date().getFullYear() - joinYear;
    const wholeFeePaid = totalPaid * Math.max(1, yearsSinceJoin);
    
    employees.push({
      id: i,
      serialNumber: i,
      dateOfJoining: joinDate.toISOString().split('T')[0],
      dateOfLeaving: leaveDate ? leaveDate.toISOString().split('T')[0] : null,
      membershipPeriod: `${membershipPeriod} years`,
      membershipNumber: `MEM${String(i).padStart(4, '0')}`,
      personalData: {
        ownName: `Assistant ${i}`,
        personalNumber: `P${String(10000 + i).padStart(5, '0')}`,
        rank: rank.title,
        fullName: `Member ${i} Name`,
        officeAddress: `${Math.floor(Math.random() * 100)} Street, ${cities[Math.floor(Math.random() * cities.length)]}`,
        residenceAddress: `${Math.floor(Math.random() * 100)} Avenue, ${cities[Math.floor(Math.random() * cities.length)]}`,
        appointment: `Appointment ${Math.floor(Math.random() * 10) + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        cnic: `XXXXX-${String(1000000 + i).slice(-7)}-X`,
        whatsapp: `03${Math.floor(Math.random() * 90000000) + 10000000}`,
        personalAssistant: {
          name: `Assistant ${i}`,
          number: `03${Math.floor(Math.random() * 90000000) + 10000000}`
        }
      },
      accountData: {
        registrationFee,
        quarterlyFee: quarterlyFeeData,
        sixMonthFee: sixMonthFeeData,
        nineMonthFee: nineMonthFeeData,
        yearlyFee: yearlyFeeData,
        totalFeePaid: totalPaid,
        feeRemaining,
        wholeFeePaidTillJoining: wholeFeePaid,
        cardReceiver: {
          name: `Receiver ${i}`,
          contact: `03${Math.floor(Math.random() * 90000000) + 10000000}`
        },
        remarks: `Rank Fee: ${rank.fee}/- per month`
      },
      // Picture removed as requested
    });
  }
  
  return employees;
};

export const mockEmployees = generateMockEmployees();
