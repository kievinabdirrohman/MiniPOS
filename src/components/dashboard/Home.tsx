import { useDeferredValue, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetProductsQuery,
  selectAllProducts,
} from "../../slices/Product.slice";
import {
  useGetCustomersQuery,
  selectAllCustomers,
} from "../../slices/Customer.slice";
import { useCreateInvoiceMutation } from "../../slices/Invoice.slice";
import {
  DataGrid,
  GridColDef,
  GridApi,
  GridCellParams,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import Layout from "./Layout";
import {
  addItem,
  sliceItem,
  removeItem,
  clearItems,
} from "../../slices/Cart.slice";
// import { RootState } from "../../Store";

const Home = () => {
  // const navigate = useNavigate();
  // const location = useLocation();
  const dispatch = useDispatch();
  const cartData = useSelector((state: any) => state.cart.products);
  const totalData = useSelector((state: any) => state.cart.totalItem);
  const totalPurchase = useSelector((state: any) => state.cart.totalPrice);
  const totalProfit = useSelector((state: any) => state.cart.totalProfit);
  const [dataPaid, setDataPaid] = useState<number>(0);
  const [createInvoice] = useCreateInvoiceMutation();
  const [customer, chooseCustomer] = useState<string>("");
  const [filterTerm, setFilterTerm] = useState<string>("");

  const handleCustomer = (event: SelectChangeEvent) => {
    chooseCustomer(event.target.value);
  };

  const columns: GridColDef[] = [
    {
      field: "sku",
      headerName: "SKU",
      type: "string",
    },
    {
      field: "name",
      headerName: "Name",
      type: "string",
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
    },
    {
      field: "purchase",
      headerName: "Purchase",
      type: "number",
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation();

          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellParams> = {};

          api
            .getAllColumns()
            .filter((c) => c.field)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );

          const profit: any = Number(thisRow.price) - Number(thisRow.purchase);

          dispatch(
            addItem({
              sku: thisRow.sku,
              name: thisRow.name,
              amount: 1,
              price: thisRow.price,
              profit: profit,
              maxItem: thisRow.stock,
            })
          );
          return;
        };

        return <Button onClick={onClick}>Add to Cart</Button>;
      },
    },
  ];

  const columnsCart: GridColDef[] = [
    {
      field: "sku",
      headerName: "SKU",
      type: "string",
    },
    {
      field: "name",
      headerName: "Name",
      type: "string",
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
    },
    {
      field: "profit",
      headerName: "Profit",
      type: "number",
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      renderCell: (params) => {
        const sliceItemData = (e: any) => {
          e.stopPropagation();
          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellParams> = {};
          api
            .getAllColumns()
            .filter((c) => c.field)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );
          dispatch(
            sliceItem({
              sku: thisRow.sku,
              price: thisRow.price,
              amount: thisRow.amount,
              profit: thisRow.profit,
            })
          );
          return;
        };
        const removeItemData = (e: any) => {
          e.stopPropagation();
          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellParams> = {};
          api
            .getAllColumns()
            .filter((c) => c.field)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );
          dispatch(
            removeItem({
              sku: thisRow.sku,
              price: thisRow.price,
              amount: thisRow.amount,
              profit: thisRow.profit,
            })
          );
          return;
        };

        return (
          <>
            <Button onClick={sliceItemData}>Slice</Button>
            <Button onClick={removeItemData}>Remove</Button>
          </>
        );
      },
    },
  ];

  const payProducts = async () => {
    if (cartData.length === 0) {
      alert("Cart is Empty");
      return false;
    }
    if (!dataPaid && dataPaid !== 0) {
      alert("Paid is Required");
      return false;
    }
    if (dataPaid < 0) {
      alert("Paid must be positive value");
      return false;
    }
    if (customer == "") {
      alert("Customer is Required");
      return false;
    }
    try {
      const invoice = {
        products: cartData,
        totalProduct: totalData,
        totalPrice: totalPurchase,
        customer: customer,
        paid: dataPaid,
        change: dataPaid - totalPurchase,
        profit: totalProfit,
        isPaid: dataPaid >= totalPurchase ? true : false,
      };
      dispatch(clearItems());
      setDataPaid(0);
      await createInvoice(invoice).unwrap();
    } catch (error) {
      alert("Cannot Save!");
    }
  };

  const { isLoading: productLoading } = useGetProductsQuery();
  const { isLoading: customerLoading } = useGetCustomersQuery();

  const getAllProducts = useSelector(selectAllProducts);
  const getAllCustomers = useSelector(selectAllCustomers);

  const filterProductBySKU = (sku: string) => {
    if (Array.isArray(getAllProducts)) {
      if (!sku) {
        return getAllProducts;
      }
      return getAllProducts.filter((product: any) => product.sku.includes(sku));
    }
  };

  const filteredProducts: any = filterProductBySKU(filterTerm);

  return (
    <Layout>
      {!productLoading && !customerLoading ? (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div style={{ height: 500 }}>
              <TextField
                autoComplete="off"
                fullWidth
                type="text"
                id="sku"
                name="sku"
                label="Search Product by SKU"
                variant="standard"
                value={filterTerm}
                onChange={(e: any) => {
                  setFilterTerm(e.target.value);
                }}
              />
              <DataGrid
                rows={filteredProducts}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={(row) => row.sku}
                disableSelectionOnClick
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div style={{ height: 500 }}>
              <DataGrid
                rows={cartData}
                columns={columnsCart}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={(row) => row.sku}
                disableSelectionOnClick
              />
              <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="select-customer">Select Customer</InputLabel>
                <Select
                  labelId="select-customer"
                  id="data-customer"
                  value={customer}
                  onChange={handleCustomer}
                  label="Select Customer"
                >
                  <MenuItem disabled value="">
                    <em>None</em>
                  </MenuItem>
                  {getAllCustomers.map((customer: any) => (
                    <MenuItem value={customer.full_name} key={customer.id}>
                      {customer.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <p>Total Item: {totalData}</p>
              <p>Total Price: {totalPurchase}</p>
              <TextField
                autoComplete="off"
                fullWidth
                type="number"
                id="paid"
                name="paid"
                label="paid"
                variant="standard"
                value={dataPaid}
                onChange={(e: any) => setDataPaid(e.target.value)}
              />
              <Button onClick={payProducts}>Purchase</Button>
            </div>
          </Grid>
        </Grid>
      ) : (
        <Skeleton variant="rectangular" height={500} />
      )}
    </Layout>
  );
};

export default Home;
