// 'use client';

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card.jsx";
import { Button } from "./components/ui/button.jsx";
import { Input } from "./components/ui/input.jsx";
import { Textarea } from "./components/ui/textarea.jsx";
import { Label } from "./components/ui/label.jsx";
import { Plus, Send, Trash2, Info, X } from "lucide-react";

// ------------------
//  ORDERING-GUIDE DATA
// ------------------

const RSMS = [
  { label: "Charles Claussen", value: "charles.claussen@vbtech.com", last: "Claussen" },
  { label: "Wes Caudle", value: "wes.caudle@vbtech.com", last: "Caudle" },
  { label: "Ryan Carroll", value: "Ryan.Carroll@vbtech.com", last: "Carroll" },
  { label: "Brian Syzdek", value: "brian.syzdek@vbtech.com", last: "Syzdek" },
];

const SECTORS = [{ code: "WW", description: "Waterworks" }];

const MODELS = [
  { code: "EN", description: "700-SIGMA EN" },
  { code: "ES", description: "700-SIGMA ES" },
];

const SIZES_BY_MODEL = {
  EN: [
    { code: "DN40", description: '1.5"' },
    { code: "DN50", description: '2"' },
    { code: "DN80", description: '3"' },
    { code: "DN100", description: '4"' },
    { code: "DN150", description: '6"' },
    { code: "DN200", description: '8"' },
    { code: "DN250", description: '10"' },
    { code: "DN300", description: '12"' },
    { code: "DN400", description: '16"' },
  ],
  ES: [
    { code: "DN65", description: '2.5"' },
    { code: "DN80", description: '3"' },
    { code: "DN100", description: '4"' },
    { code: "DN125", description: '5"' },
    { code: "DN150", description: '6"' },
    { code: "DN200", description: '8"' },
    { code: "DN250", description: '10"' },
    { code: "DN300", description: '12"' },
    { code: "DN350", description: '14"' },
    { code: "DN400", description: '16"' },
    { code: "DN450", description: '18"' },
    { code: "DN500", description: '20"' },
    { code: "DN600", description: '24"' },
  ],
};

const PRIMARY_FEATURES = [
  { code: "700", description: "Basic Valve (Double Chamber)" },
  { code: "705", description: "Basic Valve (Single Chamber)" },
  { code: "710", description: "Solenoid Controlled Valve" },
  { code: "718", description: "Electronic Control Valve" },
  { code: "7PM", description: "Pressure Mgmt, Flow Compensated PRV" },
  { code: "720", description: "Pressure Reducing Valve" },
  { code: "723", description: "Pressure Reducing & Sustaining" },
  { code: "726", description: "Differential Pressure Reducing" },
  { code: "727", description: "Flow Control – Constant Downstream Pressure" },
  { code: "730", description: "Pressure Sustaining/Relief" },
  { code: "73Q", description: "Pressure Relief, Quick Type" },
  { code: "730R", description: "Pressure Sustaining – Remote Sensing" },
  { code: "735", description: "Surge Anticipating" },
  { code: "736", description: "Differential Pressure Sustaining" },
  { code: "740", description: "Booster Pump Control (Double Chamber)" },
  { code: "742", description: "Booster Pump Control & PRV" },
  { code: "743", description: "Booster Pump Control & Sustaining" },
  { code: "745", description: "Deep Well Pump Electric Control" },
  { code: "747", description: "Booster Pump & Flow Control" },
  { code: "748", description: "Pump Circulation & Sustaining" },
  { code: "750", description: "Level Control" },
  { code: "753", description: "Level Control & Sustaining" },
  { code: "757", description: "Level & Flow Control" },
  { code: "75A", description: "Level Sustaining (Reservoir Outlet)" },
  { code: "770", description: "Flow Control" },
  { code: "772", description: "Flow Control & PRV" },
  { code: "773", description: "Flow Control & Sustaining" },
  {
