import fetch from 'node-fetch'; 

async function triggerLambdaToSendEmail(userEmail: string) {
  try {
      const response = await fetch(process.env.LAMBDA_EMAIL_URL!, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      } else {
          console.log('Email sent via Lambda');
      }
  } catch (error) {
      console.error('Error calling Lambda:', error);
  }
}

export {triggerLambdaToSendEmail}