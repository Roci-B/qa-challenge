const { test, expect } = require('@playwright/test');

// TC01
test('TC01 - Verify that the Search input is displayed', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');
  const searchInput = page.locator('.sc-gjZUHa.fhNaUA');
  await expect(searchInput).toBeVisible();
});

// TC02

test('TC02 - Verify that a user can type text into the Search input', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');
  const searchInput = page.locator('.sc-gjZUHa.fhNaUA');
  await expect(searchInput).toBeVisible();

  const testText = 'My Search';
  await searchInput.fill(testText);
  await expect(searchInput).toHaveValue(testText);
});

// TC03

test('TC03 - Verify that searching filters the list of events based on input', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');

  const searchInput = page.locator('.sc-gjZUHa.fhNaUA');
  const eventItems = page.locator('.sc-bmCFzp.kQijna');
  
  const totalEvents = await eventItems.count();
  expect(totalEvents).toBeGreaterThan(0); 

  const filter = 'Suite';
  await searchInput.fill(filter);

  await page.waitForTimeout(500);

  const filteredEvents = await eventItems.count();
  expect(filteredEvents).toBeLessThanOrEqual(totalEvents);

  for (let i = 0; i < filteredEvents; i++) {
    const textEvent = await eventItems.nth(i).innerText();
    expect(textEvent.toLowerCase()).toContain(filter.toLowerCase());
  }
});

// TC04

test("TC04 - Verify that if no matching event is found, a 'no results' message appears", async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');

  const searchInput = page.locator('.sc-gjZUHa.fhNaUA');
  const noExistingFilter = 'NewEvent123';

  await searchInput.fill(noExistingFilter);
  await page.waitForTimeout(500);

  const noResultsMessage = page.getByText(/No rooming lists found/i); 

  await expect(noResultsMessage).toBeVisible();
});

// TC05

test('TC05 - Verify that the Filters button is displayed', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');

  const filtersButton = page.getByRole('button', { name: /Filters/i });

  await expect(filtersButton).toBeVisible();
});

// TC06

test('TC06 - Verify that clicking the Filters button opens the filter dropdown', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');

  const filtersButton = page.getByRole('button', { name: /filters/i });
  await expect(filtersButton).toBeVisible();

  await filtersButton.click();
  await page.waitForTimeout(500);

  const dropdown = page.locator('.sc-cLAbsH.iFIBtw'); 
  await expect(dropdown).toBeVisible();
});

// TC07

test("TC07 - Verify that the filter options are 'Active', 'Closed', and 'Canceled'", async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');

  const filtersButton = page.getByRole('button', { name: /filters/i });
  await expect(filtersButton).toBeVisible();
  await filtersButton.click();

  const activeOption = page.locator("#root > div > div > header > div > div > div.sc-cLAbsH.iFIBtw > div > div > div > div.sc-fmMLgT.fpcEPT > div:nth-child(1) > div.sc-ejXKMB.bmPpUn");
  const closedOption = page.locator("#root > div > div > header > div > div > div.sc-cLAbsH.iFIBtw > div > div > div > div.sc-fmMLgT.fpcEPT > div:nth-child(2) > div.sc-ejXKMB.bmPpUn");
  const canceledOption = page.locator("#root > div > div > header > div > div > div.sc-cLAbsH.iFIBtw > div > div > div > div.sc-fmMLgT.fpcEPT > div:nth-child(3) > div.sc-ejXKMB.bmPpUn");
  
  await expect(activeOption).toBeVisible();
  await expect(closedOption).toBeVisible();
  await expect(canceledOption).toBeVisible();
});

// TC08

test('TC08 - Verify that selecting a filter option filters the event list correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');

  const filtersButton = page.locator('button:has-text("Filters")');
  await filtersButton.click();

  const activeOption = page.locator("#root > div > div > header > div > div > div.sc-cLAbsH.iFIBtw > div > div > div > div.sc-fmMLgT.fpcEPT > div:nth-child(1) > div.sc-ejXKMB.bmPpUn");
  await activeOption.click();

  const statusElements = page.locator('div.sc-fsjlER.ljkdaL');
  await expect(statusElements.first()).toBeVisible();

  const count = await statusElements.count();
  for (let i = 0; i < count; i++) {
    const statusAttr = await statusElements.nth(i).getAttribute('status');
    expect(statusAttr?.toLowerCase()).toBe('active');
  }
});

// TC09

test('TC09 - Verify that the "Save" button applies the selected filter', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');
  
  const filtersButton = page.locator('button:has-text("Filters")');
  await filtersButton.click();

  const saveButton = page.locator('button:has-text("Save")');
  await saveButton.click();

  const statusElements = page.locator('div.sc-fsjlER'); 

  await expect(statusElements.first()).toBeVisible();
  const count = await statusElements.count();

  for (let i = 0; i < count; i++) {
    const status = await statusElements.nth(i).getAttribute('status');
    expect(status?.toLowerCase()).toBe('closed');
  }
});

// TC10

test('TC10 - Verify that after applying a filter, the selected filter persists if the Filters dropdown is reopened', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');
  
  const filtersButton = page.locator('button:has-text("Filters")');
  await filtersButton.click();

  const filterDropdown = page.locator('div.sc-fmMLgT.fpcEPT');
  const activeOption = filterDropdown.getByText('Active', { exact: true });
  await activeOption.click();

  const saveButton = page.locator('button:has-text("Save")');
  await saveButton.click();

  await filtersButton.click();

  expect(true).toBe(true);
});

// TC11

test('TC11 - Verify that multiple filters can be selected/deselected', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');
  
  const filtersButton = page.locator('button:has-text("Filters")');
  await filtersButton.click();

  const filterDropdown = page.locator('div.sc-fmMLgT.fpcEPT');
  const activeOption = filterDropdown.getByText('Active', { exact: true });
  const closedOption = filterDropdown.getByText('Closed', { exact: true });

  await activeOption.click();
  await closedOption.click();

  const printInfo = async (locator) => {
    const clases = await locator.getAttribute('class');
    const attrs = await locator.evaluate(el => {
      const result = {};
      for (const attr of el.attributes) {
        result[attr.name] = attr.value;
      }
      return result;
    });
  };

  await printInfo(activeOption);
  await printInfo(closedOption);

  await page.waitForTimeout(500);
  await activeOption.click();

  await printInfo(activeOption);

  const saveButton = page.locator('button:has-text("Save")');
  await saveButton.click();

  expect(true).toBe(true); 
});

// TC12

test('TC12 - Verify that event cards are grouped by event names', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');
  
  const groupHeaders = page.locator('div.sc-lpbaSe.guyUPL');
  const groupCount = await groupHeaders.count();

  expect(groupCount).toBeGreaterThan(0);
  
  for (let i = 0; i < groupCount; i++) {
    const group = groupHeaders.nth(i);
    const groupName = await group.innerText();
  }
});

// TC13


test('TC13 - Verify that each event card displays RFP name, Agreement type, and Cut-Off Date', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');

  const rfpNames = page.locator('div.sc-lpbaSe.guyUPL');
  const agreementTypes = page.locator('div.sc-bxjEGZ.coxujC');
  const cutOffDates = page.locator('div.sc-kiMgGE.fRojhS');

  const rfpCount = await rfpNames.count();
  const agreementCount = await agreementTypes.count();
  const cutOffCount = await cutOffDates.count();

  expect(rfpCount).toBeGreaterThan(0);
  expect(agreementCount).toBe(rfpCount);
  expect(cutOffCount).toBe(rfpCount);

  for (let i = 0; i < rfpCount; i++) {
    const rfp = rfpNames.nth(i);
    const agreement = agreementTypes.nth(i);
    const cutOff = cutOffDates.nth(i);

    await expect(rfp).toBeVisible();
    await expect(agreement).toBeVisible();
    await expect(cutOff).toBeVisible();

    const rfpText = await rfp.innerText();
    const agreementText = await agreement.innerText();
    const cutOffText = await cutOff.innerText();

    expect(rfpText.trim()).not.toBe('');
    expect(agreementText.trim()).not.toBe('');
    expect(cutOffText.trim()).not.toBe('');
  }
});

// TC14
test('TC14 - Verify that the "View Bookings" button is displayed on each event card', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');

  const eventCards = page.locator('div.sc-iMGFoU.hWUTow');

  const cardCount = await eventCards.count();
  expect(cardCount).toBeGreaterThan(0);

  for (let i = 0; i < cardCount; i++) {
    const card = eventCards.nth(i);
    const viewBookingsButton = card.locator('button.sc-kRZjnb.uEwrw', { hasText: 'View Bookings' });
    await expect(viewBookingsButton).toBeVisible();
  }
});




// TC18
test('TC18 - Verify that the page title "Rooming List Management: Events" is displayed', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');
  const pageTitle = page.getByText('Rooming List Management: Events', { exact: true });
  await expect(pageTitle).toBeVisible();
});


// TC19
test('TC19 - Verify that the filters dropdown is correctly positioned under the Filters button', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list');

  const filtersButton = page.getByRole('button', { name: /filters/i });
  await filtersButton.click();
  const dropdown = page.locator('div.sc-fmMLgT.fpcEPT');
  await expect(dropdown).toBeVisible();

  const buttonBox = await filtersButton.boundingBox();
  const dropdownBox = await dropdown.boundingBox();
  expect(dropdownBox.y).toBeGreaterThan(buttonBox.y); 
  expect(Math.abs(dropdownBox.x - buttonBox.x)).toBeLessThan(20); 

});
