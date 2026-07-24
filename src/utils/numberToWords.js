/**
 * Converts a number to Indian English Currency Words (e.g. 1500 -> "Rupees One Thousand Five Hundred Only")
 */
export const numberToWords = (num) => {
  const n = Math.floor(Number(num) || 0);
  if (n === 0) return 'Rupees Zero Only';

  const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const formatSmall = (number) => {
    let str = '';
    if (number >= 100) {
      str += single[Math.floor(number / 100)] + ' Hundred ';
      number %= 100;
    }
    if (number >= 10 && number <= 19) {
      str += double[number - 10] + ' ';
    } else {
      if (number >= 20) {
        str += tens[Math.floor(number / 10)] + ' ';
        number %= 10;
      }
      if (number > 0) {
        str += single[number] + ' ';
      }
    }
    return str;
  };

  let words = 'Rupees ';
  let crore = Math.floor(n / 10000000);
  let remainder = n % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder %= 100000;
  let thousand = Math.floor(remainder / 1000);
  let hundred = remainder % 1000;

  if (crore > 0) {
    words += formatSmall(crore) + 'Crore ';
  }
  if (lakh > 0) {
    words += formatSmall(lakh) + 'Lakh ';
  }
  if (thousand > 0) {
    words += formatSmall(thousand) + 'Thousand ';
  }
  if (hundred > 0) {
    words += formatSmall(hundred);
  }

  return words.trim() + ' Only';
};
