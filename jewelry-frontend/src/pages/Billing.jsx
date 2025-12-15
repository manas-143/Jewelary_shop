import { useState, useEffect } from "react";
import "../pages/Billing.css";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';

function Billing() {
  const [products, setProducts] = useState([]);

  // Customer details
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");

  // Current item being added
  const [itemDescription, setItemDescription] = useState("");
  const [hsnCode, setHsnCode] = useState("7113");
  const [purity, setPurity] = useState("22K");
  const [grossWeight, setGrossWeight] = useState(0);
  const [stoneWeight, setStoneWeight] = useState(0);
  const [netGoldWeight, setNetGoldWeight] = useState(0);
  const [goldRatePerGram, setGoldRatePerGram] = useState(0);
  const [makingMode, setMakingMode] = useState("perGram"); // perGram or fixed
  const [makingValue, setMakingValue] = useState(0); // if perGram -> ₹/gm else fixed
  const [otherCharges, setOtherCharges] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [showOldGold, setShowOldGold] = useState(false);
  const [oldGoldWeight, setOldGoldWeight] = useState(0);
  const [oldGoldPurity, setOldGoldPurity] = useState("22K");
  const [oldGoldValue, setOldGoldValue] = useState(0);

  const [billItems, setBillItems] = useState([]);

  // Bill level fields
  const [gstPercent, setGstPercent] = useState(3.0);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
  }, []);

  // Keep net gold weight in sync if user prefers automatic calculation
  useEffect(() => {
    const net = parseFloat((parseFloat(grossWeight || 0) - parseFloat(stoneWeight || 0)).toFixed(3));
    setNetGoldWeight(isNaN(net) ? 0 : net);
  }, [grossWeight, stoneWeight]);

  const computeGoldValue = () => {
    const net = parseFloat(netGoldWeight || 0);
    const rate = parseFloat(goldRatePerGram || 0);
    return parseFloat((net * rate).toFixed(2));
  };

  const computeMakingCharge = () => {
    const net = parseFloat(netGoldWeight || 0);
    const val = parseFloat(makingValue || 0);
    if (makingMode === "perGram") return parseFloat((net * val).toFixed(2));
    return parseFloat(val || 0);
  };

  const computeItemTotal = () => {
    const goldVal = computeGoldValue();
    const making = computeMakingCharge();
    const other = parseFloat(otherCharges || 0);
    const oldVal = parseFloat(oldGoldValue || 0);
    // other charges are fixed per item; oldGoldValue is deducted
    return parseFloat((goldVal + making + other - oldVal).toFixed(2));
  };

  const addItemToBill = () => {
    // Basic validation
    if (!itemDescription) return;

    const goldValue = computeGoldValue();
    const making = computeMakingCharge();
    const itemTotal = computeItemTotal();

    const item = {
      itemDescription,
      hsnCode,
      purity,
      grossWeight: parseFloat(grossWeight || 0),
      stoneWeight: parseFloat(stoneWeight || 0),
      netGoldWeight: parseFloat(netGoldWeight || 0),
      goldRatePerGram: parseFloat(goldRatePerGram || 0),
      goldValue,
      makingMode,
      makingValue: parseFloat(makingValue || 0),
      makingCharge: making,
      otherCharges: parseFloat(otherCharges || 0),
      oldGoldWeight: parseFloat(oldGoldWeight || 0),
      oldGoldPurity,
      oldGoldValue: parseFloat(oldGoldValue || 0),
      remarks,
      total: itemTotal,
    };

    setBillItems([...billItems, item]);

    // reset ALL jewellery item detail fields
    setItemDescription("");
    setHsnCode("7113");
    setPurity("22K");
    setGrossWeight(0);
    setStoneWeight(0);
    setNetGoldWeight(0);
    setGoldRatePerGram(0);
    setMakingMode("perGram");
    setMakingValue(0);
    setOtherCharges(0);
    setRemarks("");
    setShowOldGold(false);
    setOldGoldWeight(0);
    setOldGoldPurity("22K");
    setOldGoldValue(0);
  };

  const removeItem = (index) => {
    const copy = [...billItems];
    copy.splice(index, 1);
    setBillItems(copy);
  };

  // Summary calculations
  const subtotal = billItems.reduce((s, it) => s + (it.goldValue || 0), 0);
  const totalMaking = billItems.reduce((s, it) => s + (it.makingCharge || 0), 0);
  const totalOther = billItems.reduce((s, it) => s + (it.otherCharges || 0), 0);
  const preGstTotal = parseFloat((subtotal + totalMaking + totalOther).toFixed(2));
  const totalGst = parseFloat(((preGstTotal * parseFloat(gstPercent || 0)) / 100).toFixed(2));
  const roundOff = parseFloat((Math.round((preGstTotal + totalGst) * 100) / 100 - (preGstTotal + totalGst)).toFixed(2));
  const grandTotal = parseFloat((preGstTotal + totalGst + roundOff).toFixed(2));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }} elevation={6}>
        <Typography variant="h4" gutterBottom>Billing</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Customer Details</Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField label="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                <TextField label="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <TextField label="GSTIN (if B2B)" value={gstin} onChange={(e) => setGstin(e.target.value)} />
              </Box>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Jewellery Item Details</Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField label="Item Description" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="e.g. Gold Necklace" />
                <TextField label="HSN Code" value={hsnCode} onChange={(e) => setHsnCode(e.target.value)} />
                <TextField select label="Purity" value={purity} onChange={(e) => setPurity(e.target.value)}>
                  <MenuItem value="24K">24K</MenuItem>
                  <MenuItem value="22K">22K</MenuItem>
                  <MenuItem value="18K">18K</MenuItem>
                </TextField>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField label="Gross Weight (gm)" type="number" value={grossWeight} onChange={(e) => setGrossWeight(e.target.value)} fullWidth />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField label="Net Gold Weight (gm)" type="number" value={netGoldWeight} onChange={(e) => setNetGoldWeight(e.target.value)} fullWidth />
                  </Grid>
                </Grid>

                <TextField label="Gold Rate per gram (₹)" type="number" value={goldRatePerGram} onChange={(e) => setGoldRatePerGram(e.target.value)} />
                <TextField label="Gold Value" value={computeGoldValue()} InputProps={{ readOnly: true }} />

                <Box>
                  <Typography variant="subtitle2">Making Charges</Typography>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Button variant={makingMode === 'perGram' ? 'contained' : 'outlined'} onClick={() => setMakingMode('perGram')}>Per gram</Button>
                    </Grid>
                    <Grid item>
                      <Button variant={makingMode === 'fixed' ? 'contained' : 'outlined'} onClick={() => setMakingMode('fixed')}>Fixed</Button>
                    </Grid>
                    <Grid item xs>
                      <TextField type="number" value={makingValue} onChange={(e) => setMakingValue(e.target.value)} placeholder={makingMode === 'perGram' ? '₹ per gm' : 'fixed ₹'} fullWidth />
                    </Grid>
                    <Grid item>
                      <TextField label="Making" value={computeMakingCharge()} InputProps={{ readOnly: true }} />
                    </Grid>
                  </Grid>
                </Box>

                <TextField label="Other Charges (₹)" type="number" value={otherCharges} onChange={(e) => setOtherCharges(e.target.value)} />
                <TextField label="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button variant="contained" color="secondary" onClick={() => setShowOldGold(!showOldGold)}>{showOldGold ? 'Hide Old Gold' : 'Add Old Gold'}</Button>
                  <Typography sx={{ ml: 1 }}>Total Item Amount: <strong>₹{computeItemTotal()}</strong></Typography>
                </Box>

                {showOldGold && (
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <TextField label="Old Gold Weight (gm)" type="number" value={oldGoldWeight} onChange={(e) => setOldGoldWeight(e.target.value)} fullWidth />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField select label="Old Gold Purity" value={oldGoldPurity} onChange={(e) => setOldGoldPurity(e.target.value)} fullWidth>
                          <MenuItem value="24K">24K</MenuItem>
                          <MenuItem value="22K">22K</MenuItem>
                          <MenuItem value="18K">18K</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                    <TextField label="Old Gold Value (₹)" type="number" value={oldGoldValue} onChange={(e) => setOldGoldValue(e.target.value)} />
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                  <Button variant="contained" color="primary" onClick={addItemToBill}>Add Item</Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Bill Items</Typography>
              {billItems.length === 0 && <Typography color="text.secondary">No items added</Typography>}
              {billItems.length > 0 && (
                <Box sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>HSN</TableCell>
                        <TableCell>Purity</TableCell>
                        <TableCell>Gross(gm)</TableCell>
                        <TableCell>Rate</TableCell>
                        <TableCell>Net(gm)</TableCell>
                        <TableCell>Gold Value</TableCell>
                        <TableCell>Making</TableCell>
                        <TableCell>Other</TableCell>
                        <TableCell>Old Gold</TableCell>
                        <TableCell>Remarks</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {billItems.map((it, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{it.itemDescription}</TableCell>
                          <TableCell>{it.hsnCode}</TableCell>
                          <TableCell>{it.purity}</TableCell>
                          <TableCell>{it.grossWeight}</TableCell>
                          <TableCell>₹{it.goldRatePerGram}</TableCell>
                          <TableCell>{it.netGoldWeight}</TableCell>
                          <TableCell>₹{it.goldValue}</TableCell>
                          <TableCell>₹{it.makingCharge}</TableCell>
                          <TableCell>₹{it.otherCharges}</TableCell>
                          <TableCell>₹{it.oldGoldValue}</TableCell>
                          <TableCell>{it.remarks}</TableCell>
                          <TableCell>₹{it.total}</TableCell>
                          <TableCell>
                            <Button size="small" color="error" onClick={() => removeItem(idx)}>Remove</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Bill Summary</Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Subtotal (Gold Value)</Typography><Typography>₹{subtotal.toFixed(2)}</Typography></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Total Making Charges</Typography><Typography>₹{totalMaking.toFixed(2)}</Typography></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Other Charges</Typography><Typography>₹{totalOther.toFixed(2)}</Typography></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>GST %</Typography>
                  <TextField type="number" value={gstPercent} onChange={(e) => setGstPercent(e.target.value)} size="small" sx={{ width: 100 }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Total GST</Typography><Typography>₹{totalGst.toFixed(2)}</Typography></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Round Off</Typography><Typography>₹{roundOff.toFixed(2)}</Typography></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}><Typography variant="h6">Grand Total</Typography><Typography variant="h6">₹{grandTotal.toFixed(2)}</Typography></Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button variant="contained">Save Bill</Button>
                  <Button variant="outlined">Print</Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Billing;
