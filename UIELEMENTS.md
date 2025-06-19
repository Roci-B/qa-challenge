# UI Elements Documentation for Rooming List Management Tests

This document summarizes the main interface elements used in automatic tests for the 'http://localhost:3000/rooming-list' page.

---

## Elements and Selectors
| Element                      | Selector                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Search Input                 | `.sc-gjZUHa.fhNaUA`                                                                                          |
| Event Items                  | `.sc-bmCFzp.kQijna`                                                                                          |
| No Results Message           | `page.getByText(/No rooming lists found/i)`                                                                  |
| Filters Button               | `page.getByRole('button', { name: /filters/i })` or `button:has-text("Filters")`                             |
| Filters Dropdown             | `.sc-cLAbsH.iFIBtw` or `div.sc-fmMLgT.fpcEPT`                                                                |
| Filter Option Active         | `filtersDropdown.getByText('Active', { exact: true })` or CSS nth-child selectors inside `.sc-fmMLgT.fpcEPT` |
| Filter Option Closed         | `filtersDropdown.getByText('Closed', { exact: true })` or CSS nth-child selectors inside `.sc-fmMLgT.fpcEPT` |
| Filter Option Canceled       | CSS nth-child(3) selector inside `.sc-fmMLgT.fpcEPT`                                                         |
| Save Button                  | `button:has-text("Save")` or `page.getByRole('button', { name: /save/i })`                                   |
| Status Elements              | `div.sc-fsjlER.ljkdaL` or `div.sc-fsjlER`                                                                    |
| Group Headers                | `div.sc-lpbaSe.guyUPL`                                                                                       |
| Agreement Types              | `div.sc-bxjEGZ.coxujC`                                                                                       |
| Cut-Off Dates                | `div.sc-kiMgGE.fRojhS`                                                                                       |
| Event Cards                  | `div.sc-iMGFoU.hWUTow`                                                                                       |
| View Bookings Button         | `button.sc-kRZjnb.uEwrw` or `button:has-text("View Bookings")`                                               |
| Bookings Container           | `div.sc-lixPIL.dkcvGm > div`                                                                                 |
| Booking Name Locator         | `div.sc-fpEFIB.gzoLBd`                                                                                       |
| Booking ID Locator           | `div.sc-fpEFIB.gzoLBd > div:nth-child(2)`                                                                    |
| Booking More Details Locator | `div.sc-ifkGpL.klVuSW`                                                                                       |
| Scroll Container             | `div.sc-cUiCeM.PMdYg`                                                                                        |
| Scroll Arrow Right           | `button.sc-gZEilz.jwPxOi` (nth(1))                                                                           |
| Page Title                   | `page.getByText('Rooming List Management: Events', { exact: true })`                                         |
| Filters Dropdown Container   | `div.sc-fmMLgT.fpcEPT`                                                                                       |
| Group Header Container       | `div.sc-bpuAaX.jOKtSV > div > div`                                                                           |
| Search Box (generic)         | `input[type="search"], input[placeholder*="search"], input`                                                  |
| No Lists Header              | `h3` element with text 'No rooming lists found'                                                              |
| Help Text Paragraph          | `p` element with text 'Import data to see rooming lists for your events.'                                    |
| Import Data Button           | `button` with text 'Import data'                                                                             |

---

