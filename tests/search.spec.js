const { test, expect } = require('@playwright/test');

// TC01
test('TC01 - Verify that the Search input is displayed', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to the page
  const searchInput = page.getByPlaceholder('Search'); // Locate search input
  await expect(searchInput).toBeVisible(); // Assert search input is visible
});

// TC02
test('TC02 - Verify that a user can type text into the Search input', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to the page
  const searchInput = page.getByPlaceholder('Search'); // Locate search input
  await expect(searchInput).toBeVisible(); // Assert search input is visible

  const testText = 'My Search'; // Text to input
  await searchInput.fill(testText); // Fill search input with text
  await expect(searchInput).toHaveValue(testText); // Assert input value matches
});

// TC03
test('TC03 - Verify that searching filters the list of events based on input', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to the page

  const searchInput = page.getByPlaceholder('Search'); // Locate search input
  const eventItems = page.locator('.sc-jCWzJg.fJVMnc'); // Locate event items

  const totalEvents = await eventItems.count(); // Count total events
  expect(totalEvents).toBeGreaterThan(0); // Assert there are events

  const filterText = 'Artist'; // Filter term
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

  const searchInput = page.getByPlaceholder('Search'); // Locate search input
  const nonExistentFilter = 'NewEvent123'; // Search term with no matches

  await searchInput.fill(nonExistentFilter); // Fill search input
  await page.waitForTimeout(500); // Wait for UI to update

  const noResultsMessage = page.getByText(/No rooming lists found/i); // Locate no results message

  await expect(noResultsMessage).toBeVisible(); // Assert no results message is visible
});

// TC05
test('TC05 - Verify that the Filters button is displayed', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to the page

  const filtersButton = page.locator('.sc-fOOuSg.jqgEdW'); // Locate Filters button

  await expect(filtersButton).toBeVisible(); // Assert Filters button is visible
});

// TC06
test('TC06 - Verify that clicking the Filters button opens the filter dropdown', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to the page

  const filtersButton = page.locator('.sc-fOOuSg.jqgEdW'); // Locate Filters button
  await expect(filtersButton).toBeVisible(); // Assert button is visible

  await filtersButton.click(); // Click the Filters button
  await page.waitForTimeout(500); // Wait for dropdown to appear

  const filtersDropdown = page.locator('.sc-lcItFd.dUihCv'); // Locate dropdown 
  await expect(filtersDropdown).toBeVisible(); // Assert dropdown is visible
});

// TC07
test("TC07 - Verify that the filter options are 'Active', 'Closed', and 'Canceled'", async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const filtersButton = page.locator('.sc-fOOuSg.jqgEdW'); // Locate Filters button
  await expect(filtersButton).toBeVisible(); // Assert visible
  await filtersButton.click(); // Click button to open dropdown

  const filtersDropdown = page.locator('.sc-lcItFd.dUihCv'); // Locate dropdown 
  const activeOption = filtersDropdown.locator('div:nth-child(1) > div.sc-eQaGpr.eUTzEW'); // Locate Active Option
  const closedOption = filtersDropdown.locator('div:nth-child(2) > div.sc-eQaGpr.eUTzEW'); // Locate Closed Option
  const canceledOption = filtersDropdown.locator('div:nth-child(3) > div.sc-eQaGpr.eUTzEW'); // Locate Cancelled Option

  const activeText = await activeOption.innerText(); // Check text for Active
  const closedText = await closedOption.innerText(); // Check text for Closed
  const canceledText = await canceledOption.innerText(); // Check text for Cancelled
  
  await expect(activeText.toLowerCase()).toBe('active'); // Assert texts for Active
  await expect(closedText.toLowerCase()).toBe('closed'); // Assert text for Closed
  await expect(canceledText.toLowerCase()).toBe('cancelled');  // Assert text for Cancelled
});

// TC08

test('TC08 - Verify that selecting a filter option filters the event list correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const filtersButton = page.locator('.sc-fOOuSg.jqgEdW'); // Locate Filters button
  await filtersButton.click(); // Open filter dropdown

  const filtersDropdown = page.locator('.sc-lcItFd.dUihCv'); // Locate dropdown 
  const activeOption = filtersDropdown.locator('div:nth-child(1) > div.sc-eQaGpr.eUTzEW'); // Locate Active Option
  const closedOption = filtersDropdown.locator('div:nth-child(2) > div.sc-eQaGpr.eUTzEW'); // Locate Closed Option
  await activeOption.click(); // Select Active
  await closedOption.click(); // Unselect Closed

  const saveButton = page.locator('.sc-VLMBG.dtMrBA'); // Locate save button
  await saveButton.click(); // Apply filter

  const eventStatus = page.locator('.sc-fYmhhH.ewiABP'); // Locate event status
  const countEvents = await eventStatus.count(); // Get count of status 

  for (let i = 0; i < countEvents; i++) {
    const statusAttr = await countEvents.nth(i).getAttribute('status'); // Get status attribute
    expect(statusAttr?.toLowerCase()).toBe('active'); // Assert status is active
  }
});

// TC09
test('TC09 - Verify that the "Save" button applies the selected filter', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const filtersButton = page.locator('.sc-fOOuSg.jqgEdW'); // Locate Filters button
  await filtersButton.click(); // Open filter dropdown

  const filtersDropdown = page.locator('.sc-lcItFd.dUihCv'); // Locate dropdown 
  const canceledOption = filtersDropdown.locator('div:nth-child(3) > div.sc-eQaGpr.eUTzEW'); // Locate Cancelled Option
  const closedOption = filtersDropdown.locator('div:nth-child(2) > div.sc-eQaGpr.eUTzEW'); // Locate Closed Option
  await canceledOption.click(); // Select Cancelled
  await closedOption.click(); // Unselect Closed

  const saveButton = page.locator('.sc-VLMBG.dtMrBA'); // Locate save button
  await saveButton.click(); // Apply filter

  const eventStatus = page.locator('.sc-fYmhhH.ewiABP'); // Locate event status
  const countEvents = await eventStatus.count(); // Get count of status 

  for (let i = 0; i < countEvents; i++) {
    const statusAttr = await statusElements.nth(i).getAttribute('status'); // Get status attribute
    expect(statusAttr?.toLowerCase()).toBe('cancelled'); // Assert status is active
  }
});

// TC10
test('TC10 - Verify that after applying a filter, the selected filter persists if the Filters dropdown is reopened', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const filtersButton = page.locator('.sc-fOOuSg.jqgEdW'); // Locate Filters button
  await filtersButton.click(); // Open filter dropdown

  const filtersDropdown = page.locator('.sc-lcItFd.dUihCv'); // Locate dropdown 
  const cancelledOption = filtersDropdown.locator('div:nth-child(3) > div.sc-eQaGpr.eUTzEW'); // Locate Cancelled Option
  const activeOption = filtersDropdown.locator('div:nth-child(1) > div.sc-eQaGpr.eUTzEW'); // Locate Active Option
  const closedOption = filtersDropdown.locator('div:nth-child(2) > div.sc-eQaGpr.eUTzEW'); // Locate Closed Option
  await cancelledOption.click(); // Select Cancelled
  await activeOption.click(); // Select Active
  await closedOption.click(); // Unselect Closed

  await filtersButton.click(); // Close filter dropdown
  await filtersButton.click(); // Open filter dropdown

  const activeCheck = page.locator('text=Active').locator('..').locator('.sc-ixcdjX.dOlUQH svg.sc-dcMTLQ.gNPTOM'); // Locate svg when option is selected
  const cancelledCheck = page.locator('div:nth-child(3) > div.sc-ixcdjX.dOlUQH > svg.sc-dcMTLQ.gNPTOM'); // Locate svg when option is selected
  const closedCheck = page.locator('text=Closed').locator('..').locator('.sc-ixcdjX.dOlUQH svg.sc-dcMTLQ.gNPTOM'); // Locate svg when option is selected

  await expect(activeCheck).toBeVisible(); // Assert on Active Option
  await expect(cancelledCheck).toBeVisible(); // Assert on Cancelled Option
  await expect(closedCheck).toHaveCount(0); // Assert on Closed Option
});

// TC11
test('TC11 - Verify that multiple filters can be selected/deselected', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const filtersButton = page.locator('.sc-fOOuSg.jqgEdW'); // Locate Filters button
  await filtersButton.click(); // Open filter dropdown

  const filtersDropdown = page.locator('.sc-lcItFd.dUihCv'); // Locate dropdown 
  const cancelledOption = filtersDropdown.locator('div:nth-child(3) > div.sc-eQaGpr.eUTzEW'); // Locate Cancelled Option
  const activeOption = filtersDropdown.locator('div:nth-child(1) > div.sc-eQaGpr.eUTzEW'); // Locate Active Option
  await cancelledOption.click(); // Select Cancelled
  await activeOption.click(); // Select Active

  const saveButton = page.locator('.sc-VLMBG.dtMrBA'); // Locate save button
  await saveButton.click(); // Apply filter

  const eventStatus = page.locator('.sc-fYmhhH.ewiABP'); // Locate event status
  const countEvents = await eventStatus.count(); // Get count of status 
  
    for (let i = 0; i < countEvents; i++) {
      const status = await eventStatus.nth(i).getAttribute('status'); // Get status on each event
      expect(['active', 'cancelled']).toContain(status?.toLowerCase()); // Assert for status
    }
});

// TC12
test('TC12 - Verify that event cards are grouped by event names', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page
  const eventGroups = page.locator('.sc-erPUmh.bWsJGH'); // Locate Group events 
  const countGroups = await eventGroups.count(); // Get count of groups events

  for (let i = 0; i < countGroups; i++) {
    const group = eventGroups.nth(i); // Group all events
    const groupNameElements = group.locator('.sc-iRTMaw.sWAKf'); // Group Events Names
    const groupName = (await groupNameElements.nth(0).textContent()).trim(); // Get Names

    const eventCards = page.locator('.sc-bSFBcf.ckYgto'); // Locate Events
    const count = await eventCards.count(); // Get events count
    expect(count).toBeGreaterThan(0); // Verify if there are results

    for (let j = 0; j < count; j++) {
      const eventName = (await eventCards.nth(j).locator('.sc-bbbBoY.iPAQMW').textContent()).trim(); // Get each event name
      expect(eventName).toBe(groupName); // Assert for Group Events names and each Event name
    }
  }
});

// TC13
test('TC13 - Verify that each event card displays RFP name, Agreement type, and Cut-Off Date', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const eventCards = page.locator('.sc-bSFBcf.ckYgto'); // Locate Events
  const count = await eventCards.count(); // Get events count
  expect(count).toBeGreaterThan(0); // Verify if there are results

  for (let i = 0; i < count; i++) {
    const card = eventCards.nth(i); // Go through all

    const cutOffDate = card.locator('.sc-jytpVa.jCaVtv'); // Locate Cut Off Date
    await expect(cutOffDate).toBeVisible(); // Assert for Cut Off Date

    const agreementType = card.locator('.sc-cdmAjP.gZNFBB'); // Locate Agreement Type
    await expect(agreementType).toBeVisible(); // Assert for Agreement Type

    const rfpName = card.locator('.sc-dNFkOE.cxrKov');// Locate RFP Name
    await expect(rfpName).toBeVisible();// Assert for RFP Name
  }
});

// TC14
test('TC14 - Verify that the "View Bookings" button is displayed on each event card', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const eventCards = page.locator('.sc-bSFBcf.ckYgto'); // Locate Events
  const count = await eventCards.count(); // Get events count
  expect(count).toBeGreaterThan(0); // Verify if there are results

  for (let i = 0; i < count; i++) {
    const card = eventCards.nth(i); // Go though all events
    const viewBookingsButton = card.locator('.sc-DZJJV.tmHpn', { hasText: 'View Bookings' }); // Locate view bookings
    await expect(viewBookingsButton).toBeVisible(); // Assert button visible
  }
});

// TC15
test('TC15 - Verify that the "View Bookings" button displays the correct number of bookings', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page
  
  const eventCards = page.locator('.sc-bSFBcf.ckYgto'); // Locate Events
  const count = await eventCards.count(); // Get events count
  expect(count).toBeGreaterThan(0); // Verify if there are results

  for (let i = 0; i < count; i++) {
    const card = eventCards.nth(i); // Go through all events

    const viewBookingsButton = card.locator('.sc-DZJJV.tmHpn', { hasText: 'View Bookings' }); // Locate view bookings
    await expect(viewBookingsButton).toBeVisible(); // Assert to check if visible

    const buttonText = await viewBookingsButton.textContent(); // Get Button text
    const match = buttonText?.match(/\((\d+)\)/); // Get number
    const bookingsCount = match ? parseInt(match[1], 10) : 0; // Convert into number

    const closeButton = page.locator('.sc-hwddKA.kvCliO'); // Locator for close modal window
    if (await closeButton.isVisible()) { // Verify if visible
      await closeButton.click(); // if visible, clicks on it
      await page.waitForTimeout(300); // wait for UI
    }

    await viewBookingsButton.click({ force: true }); // Click on View Bookings

    const bookingsContainer = page.locator('.sc-jaXbil.WTCFV'); // Container of bookings
    const bookingItems = bookingsContainer.locator('.sc-eqNDNG.eHEBjZ'); // Each booking
    await expect(bookingItems).toHaveCount(bookingsCount); // Assert for numbers

    if (await closeButton.isVisible()) { // Verify if close button is visible
      await closeButton.click(); // if visible, clicks on it
      await page.waitForTimeout(300); // wait for UI
    }
  }
});

// TC16
test('TC16 - Verify that clicking on the "View Bookings" button opens the correct booking details', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const eventCards = page.locator('.sc-bSFBcf.ckYgto'); // Locate Events
  const count = await eventCards.count(); // Get events count
  expect(count).toBeGreaterThan(0); // Verify if there are results

  const firstCard = eventCards.first(); // Get first card

  const viewBookingsButton = firstCard.locator('.sc-DZJJV.tmHpn', { hasText: 'View Bookings' }); // Locate view bookings
  await expect(viewBookingsButton).toBeVisible();

  await viewBookingsButton.click({ force: true }); // Click on View Bookings
  await page.waitForTimeout(1000); // Wait for UI

  const bookingsContainer = page.locator('.sc-jaXbil.WTCFV'); // Container of bookings
  const bookingItems = bookingsContainer.locator('.sc-eqNDNG.eHEBjZ'); // Each booking

  for (let i = 0; i < bookingItems; i++) {
    const booking = bookingItems.nth(i); // Go through all

    const nameLocator = booking.locator('div.sc-fpEFIB.gzoLBd').first(); // Locator for Name
    const idLocator = booking.locator('div.sc-fpEFIB.gzoLBd > div:nth-child(2)').first(); // Locator for ID
    const moreDetailsLocator = booking.locator('div.sc-ifkGpL.klVuSW').first(); // Locator for more details

    await expect(nameLocator).toBeVisible(); // Assert for Name
    await expect(idLocator).toBeVisible(); // Assert for ID
    await expect(moreDetailsLocator).toBeVisible(); // Assert for more details
  }
});

// TC17
test('TC17 - Verify that event cards can be scrolled horizontally if there are many', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const scrollContainer = page.locator('.sc-eqYatC.gLLZmF').first(); // Locate scroll container that holds event cards horizontally
  const arrowRightButton = page.locator('.sc-ibashp.bllble').nth(1); // Locate right arrow button for horizontal scroll

  await expect(scrollContainer).toBeVisible(); // Assert scroll container visible
  await expect(arrowRightButton).toBeVisible(); // Assert arrow visible

  const initialLeft = await scrollContainer.evaluate(el => el.style.left); // Get initial left CSS property

  await arrowRightButton.click(); // Click right arrow to scroll

  await page.waitForTimeout(300); // Wait for UI

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

  const filtersButton = page.locator('.sc-fOOuSg.jqgEdW'); // Locate Filters button
  await filtersButton.click(); // Open filter dropdown

  const filtersDropdown = page.locator('.sc-lcItFd.dUihCv'); // Locate dropdown 
  await expect(filtersDropdown).toBeVisible(); // Assert dropdown visible

  const buttonBox = await filtersButton.boundingBox(); // Get bounding box of Filters button
  const dropdownBox = await filtersDropdown.boundingBox(); // Get bounding box of dropdown

  expect(dropdownBox.y).toBeGreaterThan(buttonBox.y); // Assert dropdown is below button vertically
  expect(Math.abs(dropdownBox.x - buttonBox.x)).toBeLessThan(20); // Assert dropdown is horizontally aligned within 20px
});

// TC20
test('TC20 - Verify that each event group has a clear visual separator and container padding', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const eventContainer = page.locator('.sc-fcSHUR.cvrEFO'); // Locate event container
  await expect(eventContainer).toBeVisible(); // Check if present

  const eventSection = eventContainer.locator('.sc-jCWzJg.fJVMnc'); // Locate event section
  const eventSectionCount = await eventSection.count(); // Get count of all event sections
  expect(eventSectionCount).toBeGreaterThan(0); // Check if has elements to show

  for (let i = 0; i < eventSectionCount; i++) {
    const item = eventSection.nth(i); // Go through
    const separator = item.locator('.sc-fvubMj.dRYpac'); // Locate separator

    await expect(separator).toBeVisible(); // Assert for separator
  }
});

// TC21
test('TC21 - Verify the behavior when no events are available', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to page

  const searchInput = page.getByPlaceholder('Search'); // Locate search input
  await expect(searchInput).toBeVisible(); // Assert search input is visible

  const testText = 'Asdasd'; // Text to input
  await searchInput.fill(testText); // Fill search input with text
  await page.waitForTimeout(500); // Wait for UI

  const noListsHeader = page.locator('h3', { hasText: 'No rooming lists found' }); // Locate no results header
  await expect(noListsHeader).toBeVisible({ timeout: 7000 }); // Assert visible

  const helpText = page.locator('p', { hasText: 'Import data to see rooming lists for your events.' }); // Locate help paragraph
  await expect(helpText).toBeVisible(); // Assert visible

  const importButton = page.locator('button', { hasText: 'Import data' }); // Locate Import data button
  await expect(importButton).toBeVisible(); // Assert visible
});

//TC22
test('TC22 - Verify if search and filters work together', async ({ page }) => {
  await page.goto('http://localhost:3000/rooming-list'); // Navigate to the rooming list page

  const searchInput = page.getByPlaceholder('Search'); // Locate the search input by its placeholder text
  const searchedName = 'Ultra';
  await searchInput.fill(searchedName);
  await page.waitForTimeout(500); // Wait for UI

  const filtersButton = page.locator('.sc-fOOuSg.jqgEdW'); // Locate Filters button
  await filtersButton.click(); // Open filter dropdown

  const filtersDropdown = page.locator('.sc-lcItFd.dUihCv'); // Locate dropdown 
  const activeOption = filtersDropdown.locator('div:nth-child(1) > div.sc-eQaGpr.eUTzEW'); // Locate Active Option
  const closedOption = filtersDropdown.locator('div:nth-child(2) > div.sc-eQaGpr.eUTzEW'); // Locate Closed Option
  await activeOption.click(); // Select Active
  await closedOption.click(); // Unselect Closed

  const saveButton = page.locator('.sc-VLMBG.dtMrBA'); // Locate save button
  await saveButton.click(); // Apply filter

  await page.waitForTimeout(500); // Wait for UI

  const eventCards = page.locator('.sc-bSFBcf.ckYgto'); // Locate Events
  const count = await eventCards.count(); // Get events count
  expect(count).toBeGreaterThan(0); // Verify if there are results

  for (let i = 0; i < count; i++) {
    const card = eventCards.nth(i); // Go through all

    const nameEventText = await card.locator('.sc-bbbBoY.iPAQMW').textContent(); // Locate Event Name
    expect(nameEventText?.toLowerCase()).toContain(searchedName.toLowerCase()); // Assert event name with searched name

    const eventStatus = page.locator('.sc-fYmhhH.ewiABP'); // Locate event status
    const statusAttr = await eventStatus.nth(i).getAttribute('status'); // Get status 
    expect(statusAttr?.toLowerCase()).toBe('active'); // Assert status is active
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
