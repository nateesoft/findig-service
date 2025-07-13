const { BranchService } = require('../services/BranchService.js')

describe('BranchService', () => {
  it('should work', async () => {
    const payload = { id: 1 };
    const result = await BranchService(payload);
    expect(result).toBeDefined();
  });
});
