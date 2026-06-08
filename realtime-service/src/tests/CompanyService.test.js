const { CompanyService } = require('../services/CompanyService.js')

describe('CompanyService', () => {
  it('should work', async () => {
    const payload = { id: 1 };
    const result = await CompanyService(payload);
    expect(result).toBeDefined();
  });
});
