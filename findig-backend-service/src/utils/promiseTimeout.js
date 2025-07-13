const withTimeout = (promise, ms = 3000) => {
  let timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Operation timed out after ${ms} ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}


module.exports = {
    withTimeout
}
