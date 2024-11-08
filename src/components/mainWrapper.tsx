import { Grid } from "@mui/joy";
import { Box } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";

import { ConnectionCheckerProvider } from "../context/connectionChecker";
import { Building } from "../views/building";
import { Drones } from "../views/drones";
import { DetailedFactoryView } from "../views/factoryView";
import { DetailedGeneratorView } from "../views/generatorView";
import { PowerMain } from "../views/powerMain";
import { FactorysSwitch } from "../views/production";
import { Settings } from "../views/settings";
import { Start } from "../views/start";
import { StorageView } from "../views/storageView";
import { SocketTestSite } from "../views/testingSocket";
import { Trains } from "../views/trains";
import { Vehicles } from "../views/vehicles";
import { AwesomeSink } from "./awesomeSink";
import { Footer } from "./footer";
import { Sidebar } from "./sidebar";

export const MainWrapper: React.FC = () => {
  return (
    <Grid
      container
      sx={{ position: "relative", height: "100%" }}
    >
      <Grid sx={{ minWidth: "50px" }}>
        <Sidebar />
      </Grid>
      <Grid
        xs
        sx={{ height: "100%" }}
      >
        <Box>
          <ConnectionCheckerProvider>
            <Routes>
              <Route
                path="/"
                element={<Start />}
              />
              <Route
                path="/power"
                element={<PowerMain />}
              />
              <Route
                path="/generator"
                element={<DetailedGeneratorView />}
              />
              <Route
                path="/production"
                element={<FactorysSwitch />}
              />
              <Route
                path="/factory"
                element={<DetailedFactoryView />}
              />
              <Route
                path="/building"
                element={<Building />}
              />
              <Route
                path="/drones"
                element={<Drones />}
              />
              <Route
                path="/trains"
                element={<Trains />}
              />
              <Route
                path="/vehicles"
                element={<Vehicles />}
              />
              <Route
                path="/storageView"
                element={<StorageView />}
              />
              <Route
                path="/awesomeSink"
                element={<AwesomeSink />}
              />
              <Route
                path="/test"
                element={<SocketTestSite />}
              />
              <Route
                path="/settings"
                element={<Settings />}
              />
            </Routes>
          </ConnectionCheckerProvider>
          <Footer />
        </Box>
      </Grid>
    </Grid>
  );
};
