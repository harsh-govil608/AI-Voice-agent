"use client"
import React, { Suspense } from 'react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import ThemeProvider from './providers/ThemeProvider';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://perfect-cardinal-531.convex.cloud");

function Provider({children}) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ConvexProvider client={convex}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </ConvexProvider>
    </Suspense>
  )
}

export default Provider