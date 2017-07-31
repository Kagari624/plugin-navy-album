import _ from 'lodash'
import { createSelector } from 'reselect'
import { generalComparator } from 'subtender'
import {
  constSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-navy-album'),
  ext => _.isEmpty(ext) ? [] : ext)

const mkExtPropSelector = _.memoize(propName =>
  createSelector(extSelector, ext => ext[propName]))

const uiSelector =
  mkExtPropSelector('ui')

const indexedShipGraphsSelector = createSelector(
  constSelector,
  ({$shipgraph}) => _.keyBy($shipgraph, 'api_id'))

const shipGraphInfoSelector = createSelector(
  constSelector,
  indexedShipGraphsSelector,
  ({$ships}, indexedShipGraphs) => {
    const mstIds = Object.keys($ships)
      .map(Number).sort(generalComparator)
    return mstIds.map(mstId => {
      const $ship = $ships[mstId]
      const $shipgraph = indexedShipGraphs[mstId]
      const shipName = $ship.api_name
      return {
        mstId,
        shipName,
        graphInfo: {
          fileName: $shipgraph.api_filename,
          versionStr: $shipgraph.api_version[0],
        },
      }
    })
  }
)

// returns an Array of ShipInfo, order is unspecified.
const shipsInfoSelector = createSelector(
  constSelector,
  ({$ships}) => Object.values($ships).map($ship => {
    const mstId = $ship.api_id
    const sortNo = $ship.api_sortno
    const name = $ship.api_name
    const stype = $ship.api_stype
    return {
      mstId,
      name,
      sortNo,
      stype,
    }
  })
)

export {
  extSelector,
  uiSelector,
  shipGraphInfoSelector,
  shipsInfoSelector,
}