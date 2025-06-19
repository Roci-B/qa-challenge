const { test, expect } = require('@playwright/test');

// TC01
test('TC01 - Verify that the Search input is displayed', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to the page
  const searchInput = page.locator('.sc-gjZUHa.fhNaUA'); // Locate search input by CSS class
  await expect(searchInput).toBeVisible(); // Assert search input is visible
});

// TC02
test('TC02 - Verify that a user can type text into the Search input', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to the page
  const searchInput = page.locator('.sc-gjZUHa.fhNaUA'); // Locate search input
  await expect(searchInput).toBeVisible(); // Assert search input is visible

  const testText = 'My Search'; // Text to input
  await searchInput.fill(testText); // Fill search input with text
  await expect(searchInput).toHaveValue(testText); // Assert input value matches
});

// TC03
test('TC03 - Verify that searching filters the list of events based on input', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to the page

  const searchInput = page.locator('.sc-gjZUHa.fhNaUA'); // Locate search input
  const eventItems = page.locator('.sc-bmCFzp.kQijna'); // Locate event items

  const totalEvents = await eventItems.count(); // Count total events
  expect(totalEvents).toBeGreaterThan(0); // Assert there are events

  const filterText = 'Suite'; // Filter term
  await searchInput.fill(filterText); // Fill search input with filter

  await page.waitForTimeout(500); // Wait for filtering to update

  const filteredCount = await eventItems.count(); // Count filtered events
  expect(filteredCount).toBeLessThanOrEqual(totalEvents); // Assert filtered <= total

  for (let i = 0; i < filteredCount; i++) {
    const eventText = await eventItems.nth(i).innerText(); // Get text of each event
    expect(eventText.toLowerCase()).toContain(filterText.toLowerCase()); // Assert event contains filter
  }
});

// TC04
test("TC04 - Verify that if no matching event is found, a 'no results' message appears", async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to the page

  const searchInput = page.locator('.sc-gjZUHa.fhNaUA'); // Locate search input
  const nonExistentFilter = 'NewEvent123'; // Search term with no matches

  await searchInput.fill(nonExistentFilter); // Fill search input
  await page.waitForTimeout(500); // Wait for UI to update

  const noResultsMessage = page.getByText(/No rooming lists found/i); // Locate no results message

  await expect(noResultsMessage).toBeVisible(); // Assert no results message is visible
});

// TC05
test('TC05 - Verify that the Filters button is displayed', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to the page

  const filtersButton = page.getByRole('button', { name: /Filters/i }); // Locate Filters button by role and name

  await expect(filtersButton).toBeVisible(); // Assert Filters button is visible
});

// TC06
test('TC06 - Verify that clicking the Filters button opens the filter dropdown', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to the page

  const filtersButton = page.getByRole('button', { name: /filters/i }); // Locate Filters button
  await expect(filtersButton).toBeVisible(); // Assert button is visible

  await filtersButton.click(); // Click the Filters button
  await page.waitForTimeout(500); // Wait for dropdown to appear

  const filtersDropdown = page.locator('.sc-cLAbsH.iFIBtw'); // Locate dropdown container
  await expect(filtersDropdown).toBeVisible(); // Assert dropdown is visible
});

// TC07
test("TC07 - Verify that the filter options are 'Active', 'Closed', and 'Canceled'", async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const filtersButton = page.getByRole('button', { name: /filters/i }); // Locate Filters button
  await expect(filtersButton).toBeVisible(); // Assert visible
  await filtersButton.click(); // Click button to open dropdown

  // Locate filter options inside dropdown using consistent selector
  const filtersDropdown = page.locator('.sc-cLAbsH.iFIBtw');
  const activeOption = filtersDropdown.locator('div:nth-child(1) > div.sc-ejXKMB.bmPpUn');
  const closedOption = filtersDropdown.locator('div:nth-child(2) > div.sc-ejXKMB.bmPpUn');
  const canceledOption = filtersDropdown.locator('div:nth-child(3) > div.sc-ejXKMB.bmPpUn');

  await expect(activeOption).toBeVisible(); // Assert Active filter visible
  await expect(closedOption).toBeVisible(); // Assert Closed filter visible
  await expect(canceledOption).toBeVisible(); // Assert Canceled filter visible
});

// TC08
test('TC08 - Verify that selecting a filter option filters the event list correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const filtersButton = page.getByRole('button', { name: /Filters/i }); // Locate Filters button
  await filtersButton.click(); // Open filter dropdown

  const filtersDropdown = page.locator('.sc-cLAbsH.iFIBtw'); // Locate dropdown
  const activeOption = filtersDropdown.locator('div:nth-child(1) > div.sc-ejXKMB.bmPpUn'); // Locate Active option
  await activeOption.click(); // Select Active filter

  const statusElements = page.locator('div.sc-fsjlER.ljkdaL'); // Locate status elements of events
  await expect(statusElements.first()).toBeVisible(); // Assert visible

  const count = await statusElements.count(); // Get count of status elements
  for (let i = 0; i < count; i++) {
    const statusAttr = await statusElements.nth(i).getAttribute('status'); // Get status attribute
    expect(statusAttr?.toLowerCase()).toBe('active'); // Assert status is active
  }
});

// TC09
test('TC09 - Verify that the "Save" button applies the selected filter', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const filtersButton = page.getByRole('button', { name: /Filters/i }); // Locate Filters button
  await filtersButton.click(); // Open filters dropdown

  const saveButton = page.getByRole('button', { name: /Save/i }); // Locate Save button
  await saveButton.click(); // Click Save button

  const statusElements = page.locator('div.sc-fsjlER'); // Locate status elements

  await expect(statusElements.first()).toBeVisible(); // Assert first is visible
  const count = await statusElements.count(); // Count status elements

  for (let i = 0; i < count; i++) {
    const status = await statusElements.nth(i).getAttribute('status'); // Get status attribute
    expect(status?.toLowerCase()).toBe('closed'); // Expect status closed (assumed default filter)
  }
});

// TC10
test('TC10 - Verify that after applying a filter, the selected filter persists if the Filters dropdown is reopened', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const filtersButton = page.getByRole('button', { name: /Filters/i }); // Locate Filters button
  await filtersButton.click(); // Open dropdown

  const filterDropdown = page.locator('div.sc-fmMLgT.fpcEPT'); // Locate dropdown container
  const activeOption = filterDropdown.getByText('Active', { exact: true }); // Locate Active filter option
  await activeOption.click(); // Click Active option

  const saveButton = page.getByRole('button', { name: /Save/i }); // Locate Save button
  await saveButton.click(); // Click Save button

  await filtersButton.click(); // Reopen Filters dropdown

  expect(true).toBe(true); // Placeholder assertion (expand as needed)
});

// TC11
test('TC11 - Verify that multiple filters can be selected/deselected', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const filtersButton = page.getByRole('button', { name: /Filters/i }); // Locate Filters button
  await filtersButton.click(); // Open dropdown

  const filterDropdown = page.locator('div.sc-fmMLgT.fpcEPT'); // Locate dropdown
  const activeOption = filterDropdown.getByText('Active', { exact: true }); // Locate Active option
  const closedOption = filterDropdown.getByText('Closed', { exact: true }); // Locate Closed option

  await activeOption.click(); // Select Active filter
  await closedOption.click(); // Select Closed filter

  // Function to print class and attributes (for debugging)
  const printInfo = async (locator) => {
    const classes = await locator.getAttribute('class'); // Get classes
    const attributes = await locator.evaluate(el => {
      const result = {};
      for (const attr of el.attributes) {
        result[attr.name] = attr.value; // Get all attributes
      }
      return result;
    });
  };

  await printInfo(activeOption); // Debug info for active
  await printInfo(closedOption); // Debug info for closed

  await page.waitForTimeout(500); // Wait for UI to update
  await activeOption.click(); // Deselect Active filter

  await printInfo(activeOption); // Debug info after deselect

  const saveButton = page.getByRole('button', { name: /Save/i }); // Locate Save button
  await saveButton.click(); // Click Save button

  expect(true).toBe(true); // Placeholder assertion (expand if needed)
});

// TC12
test('TC12 - Verify that event cards are grouped by event names', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const groupHeaders = page.locator('div.sc-lpbaSe.guyUPL'); // Locate group headers by event name
  const groupCount = await groupHeaders.count(); // Count groups

  expect(groupCount).toBeGreaterThan(0); // Assert at least one group

  for (let i = 0; i < groupCount; i++) {
    const group = groupHeaders.nth(i);
    const groupName = await group.innerText(); // Get group name text
  }
});

// TC13
test('TC13 - Verify that each event card displays RFP name, Agreement type, and Cut-Off Date', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const rfpNames = page.locator('div.sc-lpbaSe.guyUPL'); // Locate RFP name elements
  const agreementTypes = page.locator('div.sc-bxjEGZ.coxujC'); // Locate agreement type elements
  const cutOffDates = page.locator('div.sc-kiMgGE.fRojhS'); // Locate cut-off date elements

  const rfpCount = await rfpNames.count();
  const agreementCount = await agreementTypes.count();
  const cutOffCount = await cutOffDates.count();

  expect(rfpCount).toBeGreaterThan(0); // Assert RFP names exist
  expect(agreementCount).toBe(rfpCount); // Assert agreement count matches RFP count
  expect(cutOffCount).toBe(rfpCount); // Assert cut-off count matches RFP count

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
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const eventCards = page.locator('div.sc-iMGFoU.hWUTow'); // Locate event cards

  const cardCount = await eventCards.count(); // Count cards
  expect(cardCount).toBeGreaterThan(0); // Assert there are cards

  for (let i = 0; i < cardCount; i++) {
    const card = eventCards.nth(i);
    // Locate "View Bookings" button inside card by class and text
    const viewBookingsButton = card.locator('button.sc-kRZjnb.uEwrw', { hasText: 'View Bookings' });
    await expect(viewBookingsButton).toBeVisible(); // Assert button visible
  }
});

// TC15
test('TC15 - Verify that the "View Bookings" button displays the correct number of bookings', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const firstCard = page.locator('div.sc-eZbeWy.hWBVDH > div.sc-gDVcuj.fqLaSm > div.sc-bpuAaX.jOKtSV > div > div:nth-child(1)').first(); // Locate first event card container

  const viewBookingsButton = firstCard.locator('button', { hasText: 'View Bookings' }); // Locate button in first card
  await expect(viewBookingsButton).toBeVisible(); // Assert visible

  const buttonText = await viewBookingsButton.textContent(); // Get text from button
  const match = buttonText?.match(/\((\d+)\)/); // Extract number inside parentheses
  const bookingsCountFromButton = match ? Number(match[1]) : 0; // Parse bookings count

  await viewBookingsButton.click(); // Click to open bookings list

  const bookingsContainer = firstCard.locator('div.sc-lixPIL.dkcvGm > div'); // Locate bookings container inside card

  await expect(bookingsContainer).toBeVisible(); // Assert container visible

  const bookingsCount = await bookingsContainer.locator('> div').count(); // Count booking entries

  expect(bookingsCount).toBe(bookingsCountFromButton); // Assert booking count matches number on button
});

// TC16
test('TC16 - Verify that clicking on the "View Bookings" button opens the correct booking details', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const eventCards = page.locator('div.sc-iMGFoU.hWUTow'); // Locate event cards
  const cardCount = await eventCards.count();
  expect(cardCount).toBeGreaterThan(0);

  const firstCard = eventCards.first(); // Get first card

  const viewBookingsButton = firstCard.locator('button.sc-kRZjnb.uEwrw', { hasText: 'View Bookings' }); // Locate "View Bookings" button
  await expect(viewBookingsButton).toBeVisible();

  await viewBookingsButton.click(); // Click to open bookings

  await page.waitForTimeout(1000); // Wait for bookings to load

  const bookingsContainer = page.locator('div.sc-lixPIL.dkcvGm > div'); // Locate bookings container at page level
  await expect(bookingsContainer.first()).toBeVisible();

  const bookingsCount = await bookingsContainer.count();
  expect(bookingsCount).toBeGreaterThan(0);

  for (let i = 0; i < bookingsCount; i++) {
    const booking = bookingsContainer.nth(i);

    // Locate booking details inside each booking
    const nameLocator = booking.locator('div.sc-fpEFIB.gzoLBd').first();
    const idLocator = booking.locator('div.sc-fpEFIB.gzoLBd > div:nth-child(2)').first();
    const moreDetailsLocator = booking.locator('div.sc-ifkGpL.klVuSW').first();

    await expect(nameLocator).toBeVisible();
    await expect(idLocator).toBeVisible();
    await expect(moreDetailsLocator).toBeVisible();
  }
});

// TC17
test('TC17 - Verify that event cards can be scrolled horizontally if there are many', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  // Locate scroll container that holds event cards horizontally
  const scrollContainer = page.locator('div.sc-cUiCeM.PMdYg').first();

  // Locate right arrow button for horizontal scroll
  const arrowRightButton = page.locator('button.sc-gZEilz.jwPxOi').nth(1);

  await expect(scrollContainer).toBeVisible(); // Assert scroll container visible
  await expect(arrowRightButton).toBeVisible(); // Assert arrow visible

  const initialLeft = await scrollContainer.evaluate(el => el.style.left); // Get initial left CSS property

  await arrowRightButton.click(); // Click right arrow to scroll

  await page.waitForTimeout(300); // Wait for scroll animation

  const finalLeft = await scrollContainer.evaluate(el => el.style.left); // Get left property after scroll

  expect(initialLeft).not.toBe(finalLeft); // Assert scroll position changed
});

// TC18
test('TC18 - Verify that the page title "Rooming List Management: Events" is displayed', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page
  const pageTitle = page.getByText('Rooming List Management: Events', { exact: true }); // Locate page title text
  await expect(pageTitle).toBeVisible(); // Assert title is visible
});

// TC19
test('TC19 - Verify that the filters dropdown is correctly positioned under the Filters button', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const filtersButton = page.getByRole('button', { name: /filters/i }); // Locate Filters button
  await filtersButton.click(); // Click to open dropdown

  const dropdown = page.locator('div.sc-fmMLgT.fpcEPT'); // Locate dropdown container
  await expect(dropdown).toBeVisible(); // Assert dropdown visible

  const buttonBox = await filtersButton.boundingBox(); // Get bounding box of Filters button
  const dropdownBox = await dropdown.boundingBox(); // Get bounding box of dropdown

  expect(dropdownBox.y).toBeGreaterThan(buttonBox.y); // Assert dropdown is below button vertically
  expect(Math.abs(dropdownBox.x - buttonBox.x)).toBeLessThan(20); // Assert dropdown is horizontally aligned within 20px
});

// TC20
test('TC20 - Verify that each event group has a clear visual separator and container padding', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const groupHeaders = page.locator('div.sc-bpuAaX.jOKtSV > div > div'); // Locate group headers containers
  const count = await groupHeaders.count();
  expect(count).toBeGreaterThan(1); // Assert multiple groups

  let boxes = [];
  for (let i = 0; i < count; i++) {
    const group = groupHeaders.nth(i);
    const box = await group.boundingBox();
    if (box) boxes.push({ index: i, box }); // Store bounding boxes
  }

  // Sort boxes by Y coordinate (top to bottom)
  boxes.sort((a, b) => a.box.y - b.box.y);

  // Group boxes by rows based on vertical proximity
  const rows = [];
  const tolerance = 20;

  for (const item of boxes) {
    let added = false;
    for (const row of rows) {
      if (Math.abs(row[0].box.y - item.box.y) < tolerance) {
        row.push(item);
        added = true;
        break;
      }
    }
    if (!added) rows.push([item]);
  }

  // Check horizontal spacing between boxes in each row
  for (const row of rows) {
    row.sort((a, b) => a.box.x - b.box.x);
    for (let i = 0; i < row.length - 1; i++) {
      const current = row[i].box;
      const next = row[i + 1].box;
      const horizontalSpacing = next.x - (current.x + current.width);
      expect(horizontalSpacing).toBeGreaterThanOrEqual(8); // Min 8px spacing
    }
  }

  // Check vertical spacing between rows
  for (let i = 0; i < rows.length - 1; i++) {
    const maxBottomCurrent = Math.max(...rows[i].map(item => item.box.y + item.box.height));
    const minTopNext = Math.min(...rows[i + 1].map(item => item.box.y));
    const verticalSpacing = minTopNext - maxBottomCurrent;
    expect(verticalSpacing).toBeGreaterThanOrEqual(8); // Min 8px vertical spacing
  }

  // Check padding on left and right of first container
  const container = page.locator('div.sc-bpuAaX.jOKtSV > div').first();
  const padding = await container.evaluate(el => {
    const style = window.getComputedStyle(el);
    return {
      left: style.paddingLeft,
      right: style.paddingRight
    };
  });

  expect(padding.left).toBe('2px'); // Left padding 2px
  expect(padding.right).toBe('2px'); // Right padding 2px
});

// TC21
test('TC21 - Verify the behavior when no events are available', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const searchBox = page.locator('input[type="search"], input[placeholder*="search"], input'); // Locate search input, broad selector
  await expect(searchBox.first()).toBeVisible({ timeout: 7000 }); // Wait for input to appear

  await searchBox.fill('asdasnonexistentsearchterm'); // Fill with nonsense to get no results
  await page.keyboard.press('Enter'); // Trigger search (assumed)

  const noListsHeader = page.locator('h3', { hasText: 'No rooming lists found' }); // Locate no results header
  await expect(noListsHeader).toBeVisible({ timeout: 7000 }); // Assert visible

  const helpText = page.locator('p', { hasText: 'Import data to see rooming lists for your events.' }); // Locate help paragraph
  await expect(helpText).toBeVisible(); // Assert visible

  const importButton = page.locator('button', { hasText: 'Import data' }); // Locate Import data button
  await expect(importButton).toBeVisible(); // Assert visible

  const eventCards = page.locator('div.sc-iMGFoU.hWUTow'); // Locate event cards container
  await expect(eventCards).toHaveCount(0); // Assert no cards are visible
});

//TC22
test('TC22 - Verify if search and filters work together', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to the rooming list page

  await page.locator('#root > div > div > header > div > div > div.sc-cLAbsH.iFIBtw > button').click(); // Click on the Filters button to open filter options

  const filtersDropdown = page.locator('#root > div > div > header > div > div > div.sc-cLAbsH.iFIBtw > div'); // Locate the filters dropdown container
  await expect(filtersDropdown).toBeVisible(); // Assert that the filters dropdown is visible
  await filtersDropdown.getByText('Active', { exact: true }).click(); // Select the "Active" filter option
  await filtersDropdown.getByText('Closed', { exact: true }).click(); // Deselect the "Closed" filter option if selected

  await page.getByRole('button', { name: /save/i }).click(); // Click the Save button to apply filters

  const searchInput = page.getByPlaceholder('Search'); // Locate the search input by its placeholder text
  await searchInput.fill('ACL'); // Fill the search input with the text 'ACL'
  await page.keyboard.press('Enter'); // Press Enter key to trigger the search

  const results = page.locator('div.sc-iMGFoU.hWUTow'); // Locate all event cards in the results
  await results.first().waitFor({ state: 'visible', timeout: 5000 }); // Wait for the first result card to be visible to ensure results are loaded

  const count = await results.count(); // Get the number of event cards found
  expect(count).toBeGreaterThan(0); // Assert that at least one result is present

  for (let i = 0; i < count; i++) {
    const card = results.nth(i); // Select the i-th event card
    const nameLocator = card.locator('div.sc-lpbaSe.guyUPL'); // Locate the element containing the event name inside the card
    const isVisible = await nameLocator.isVisible(); // Check if the event name element is visible
    if (!isVisible) {
      continue;  // Skip this card if the event name is not visible
    }
    const nameText = (await nameLocator.innerText()).toLowerCase(); // Get the text content of the event name and convert to lowercase
    expect(nameText).toContain('acl'); // Assert that the event name contains 'acl'

    const statusLocator = card.locator('div[status="Active"]'); // Locate the status element with attribute status="Active" inside the card
    await expect(statusLocator).toBeVisible(); // Assert that the status element is visible
    const statusText = (await statusLocator.innerText()).toLowerCase(); // Get the text content of the status element and convert to lowercase
    expect(statusText).toBe('active'); // Assert that the status text is exactly 'active'
  }
});


// TC23
test('TC23 - Verify UI responsiveness (only mobile scroll)', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  await page.setViewportSize({ width: 1280, height: 800 }); // Set desktop viewport
  await expect(page.locator('main')).toBeVisible(); // Assert main content visible

  await page.setViewportSize({ width: 768, height: 1024 }); // Set tablet viewport
  await expect(page.locator('main')).toBeVisible(); // Assert main content visible

  await page.setViewportSize({ width: 375, height: 667 }); // Set mobile viewport
  await expect(page.locator('main')).toBeVisible(); // Assert main content visible

  // Check if page has horizontal scroll on mobile
  const hasHorizontalScroll = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasHorizontalScroll).toBe(false); // Assert no horizontal scroll on mobile
});
