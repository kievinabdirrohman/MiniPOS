import { useDeferredValue, useState, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetProductsQuery,
  selectAllProducts,
} from "../../slices/Product.slice";
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
  const [dataPaid, setDataPaid] = useState<number>(0);

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

          dispatch(
            addItem({
              sku: thisRow.sku,
              name: thisRow.name,
              amount: 1,
              price: thisRow.price,
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

  const payProducts = () => {
    const invoice = {
      products: cartData,
      totalProduct: totalData,
      totalPrice: totalPurchase,
      paid: dataPaid,
      change: dataPaid - totalPurchase,
    };
    dispatch(clearItems());
    setDataPaid(0);
    console.log(invoice);
  };

  useGetProductsQuery();
  const getAllProducts = useSelector(selectAllProducts);

  return (
    <Layout>
      {Array.isArray(getAllProducts) && getAllProducts.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div style={{ height: 500 }}>
              <DataGrid
                rows={getAllProducts}
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
                getRowId={(row) => row.sku}
                disableSelectionOnClick
              />
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
