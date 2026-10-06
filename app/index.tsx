/**
 * Filename:    index.tsx  [ app ]
 * Description: Root index route.
 * Purpose:     Redirect the app root ("/") to the Scanner tab, which is the
 *              first screen in the source web app's navigation order.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Redirect } from 'expo-router';

export default function Index(): React.JSX.Element {
  return <Redirect href="/scanner" />;
}
