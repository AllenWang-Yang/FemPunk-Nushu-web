# My Paints Page

## Overview
The "My Paints" page displays all artworks that the connected user has contributed to, along with their contribution details and settlement options.

## Features

### 1. Wallet Connection Required
- Users must connect their wallet to view this page
- Shows a connection prompt if wallet is not connected

### 2. Canvas Grid Display
- Similar layout to the Gallery page
- Shows all canvases the user has contributed to
- Displays canvas preview image or placeholder

### 3. Contribution Information
- **Contribution**: Number of contributions made by the user
- **Settleable Amount**: Amount of ETH available for settlement (in English)

### 4. Settlement Button
- **Green Button** (Active): 
  - Shown when canvas `status === 3` (settled) AND `settleable_amount > 0`
  - Uses project's green color: `#1ee11f`
  - Displays the settleable amount in ETH
  - Clickable to initiate settlement
  
- **Gray Button** (Inactive):
  - Shown when canvas is not yet settled or has no settleable amount
  - Disabled state with gray background
  - Shows "Not Settleable" text

## API Integration

### Endpoint
```
GET /api/contributions/contributor/:address
```

### Response Format
```typescript
{
  success: true,
  canvases: [
    {
      canvas_id: string,
      day_timestamp: number,
      metadata_uri: string,
      total_raised_wei: string,
      settleable_amount: number,
      finalized: number,
      contributions: number,
      created_ts: number,
      status: number // 0=stopped, 1=active, 2=minted, 3=settled
    }
  ]
}
```

## Canvas Status Values
- `0`: Stopped
- `1`: Active (painting/selling)
- `2`: Minted
- `3`: Settled (ready for settlement)

## Navigation
Added "MY PAINTS" to the main navigation bar, which appears after GALLERY.

## Styling
- Matches the design of the Gallery page
- Uses project's color scheme:
  - Background: `#161616`
  - Green accent: `#1ee11f`
  - Card background: `zinc-800`
- Responsive layout with max-width of 1440px
