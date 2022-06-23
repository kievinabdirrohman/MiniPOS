import { useDeferredValue, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetProductsQuery } from "../../slices/Product.slice";
import {
  DataGrid,
  GridColDef,
  GridApi,
  GridCellParams,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";

import Layout from "./Layout";
import { addItem } from "../../slices/Cart.slice";
// import { RootState } from "../../Store";

const Home = () => {
  // const navigate = useNavigate();
  // const location = useLocation();
  const dispatch = useDispatch();
  const cartData = useSelector((state: any) => state.cart.products);
  

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

          dispatch(addItem({ sku: thisRow.sku, name: thisRow.name, amount: 1, price: thisRow.price }));
          return;
        };

        return <Button onClick={onClick}>Add to Cart</Button>;
      },
    },
  ];

  const {data} = useGetProductsQuery();
  
  const dataProducts = useDeferredValue(data);

  return (
    <Layout>
      {dataProducts ? (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div style={{ height: 500 }}>
              <DataGrid
                rows={dataProducts}
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
                columns={columns}
                getRowId={(row) => row.sku}
                disableSelectionOnClick
              />
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
