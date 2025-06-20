# UI Elements Documentation for Rooming List Management Tests

This document summarizes the main interface elements used in automatic tests for the 'http://localhost:3000/rooming-list' page.

---

## Elements and Selectors
| **Element**           | **Locator**                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| `searchInput`         | `page.getByPlaceholder('Search')`                                                                        |
| `eventItems`          | `page.locator('.sc-jCWzJg.fJVMnc')`                                                                      |
| `noResultsMessage`    | `page.getByText(/No rooming lists found/i)`                                                              |
| `filtersButton`       | `page.locator('.sc-fOOuSg.jqgEdW')`                                                                      |
| `filtersDropdown`     | `page.locator('.sc-lcItFd.dUihCv')`                                                                      |
| `activeOption`        | `filtersDropdown.locator('div:nth-child(1) > div.sc-eQaGpr.eUTzEW')`                                     |
| `closedOption`        | `filtersDropdown.locator('div:nth-child(2) > div.sc-eQaGpr.eUTzEW')`                                     |
| `canceledOption`      | `filtersDropdown.locator('div:nth-child(3) > div.sc-eQaGpr.eUTzEW')`                                     |
| `saveButton`          | `page.locator('.sc-VLMBG.dtMrBA')`                                                                       |
| `eventStatus`         | `page.locator('.sc-fYmhhH.ewiABP')`                                                                      |
| `eventGroups`         | `page.locator('.sc-erPUmh.bWsJGH')`                                                                      |
| `groupNameElements`   | `group.locator('.sc-iRTMaw.sWAKf')`                                                                      |
| `eventCards`          | `page.locator('.sc-bSFBcf.ckYgto')`                                                                      |
| `eventName`           | `eventCards.nth(j).locator('.sc-bbbBoY.iPAQMW')`                                                         |
| `cutOffDate`          | `card.locator('.sc-jytpVa.jCaVtv')`                                                                      |
| `agreementType`       | `card.locator('.sc-cdmAjP.gZNFBB')`                                                                      |
| `rfpName`             | `card.locator('.sc-dNFkOE.cxrKov')`                                                                      |
| `viewBookingsButton`  | `card.locator('.sc-DZJJV.tmHpn', { hasText: 'View Bookings' })`                                          |
| `closeButton`         | `page.locator('.sc-hwddKA.kvCliO')`                                                                      |
| `bookingsContainer`   | `page.locator('.sc-jaXbil.WTCFV')`                                                                       |
| `bookingItems`        | `bookingsContainer.locator('.sc-eqNDNG.eHEBjZ')`                                                         |
| `scrollContainer`     | `page.locator('.sc-eqYatC.gLLZmF').first()`                                                              |
| `arrowRightButton`    | `page.locator('.sc-ibashp.bllble').nth(1)`                                                               |
| `pageTitle`           | `page.getByText('Rooming List Management: Events', { exact: true })`                                     |
| `eventContainer`      | `page.locator('.sc-fcSHUR.cvrEFO')`                                                                      |
| `eventSection`        | `eventContainer.locator('.sc-jCWzJg.fJVMnc')`                                                            |
| `separator`           | `item.locator('.sc-fvubMj.dRYpac')`                                                                      |
| `noListsHeader`       | `page.locator('h3', { hasText: 'No rooming lists found' })`                                              |
| `helpText`            | `page.locator('p', { hasText: 'Import data to see rooming lists for your events.' })`                    |
| `importButton`        | `page.locator('button', { hasText: 'Import data' })`                                                     |

---

