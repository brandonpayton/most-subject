/* @flow */

export function fatalError (err: Error) {
  setTimeout(() => { throw err }, 0)
}
