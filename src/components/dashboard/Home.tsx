import {useDeferredValue, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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
import { RootState } from "../../Store";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItem, addItemToCart] = useState<any>([]);

  let cart: any[] = [];
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

          let itemFounded: boolean = false;

          api
            .getAllColumns()
            .filter((c) => c.field)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );

          for (const key in cart) {
            if (cart[key].sku === thisRow.sku) {
              cart[key].amount++;
              itemFounded = true;
              break;
            }
          }
          if (!itemFounded) {
            cart.push({ sku: thisRow.sku, name: thisRow.name, amount: 1 });
          }
          addItemToCart(cartItem.concat(cart));
          console.log(cartItem);
          return;
        };

        return <Button onClick={onClick}>Add to Cart</Button>;
      },
    },
  ];

  const { data, isLoading, isSuccess, isError, error } = useGetProductsQuery();
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
                rows={cartItem}
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
