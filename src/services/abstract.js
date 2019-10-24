export default class Resource {
  /**
   * @param data {Object[]}
   */
  constructor(data) {
    this.data = data
  }

  /**
   * Returns total rows count
   * @returns {Promise}
   */
  getTotal() {
    return this._promise(this.data.length)
  }

  /**
   * Finds specific row by its ID
   * @param id {int} ID or the row
   * @returns {Promise}
   */
  find(id) {
    const item = this.data.find(el => el.id === id)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (item === undefined) {
          reject('Not found')
        } else {
          resolve(this._clone(item))
        }
      }, 100)
    })
  }

  /**
   * Performs batch select from the data array
   * @param field {string} Column name
   * @param values {array} List of possible column values
   * @param page {int} Page index starting from 0
   * @param perPage {int} Rows per page
   * @param orderBy? {string} Column name to sort with (ASC)
   * @returns {Promise}
   */
  getBatch(field, values, page = 0, perPage = 5, orderBy = 'id') {
    const filtered = this.data.filter(el => values.includes(el[field]))
    const oredered = this._orderBy(filtered, orderBy)
    const result = this._paginate(oredered, page, perPage)

    return this._promise(result)
  }

  /**
   * Returns paginated rows
   * @param page {int} Page index starting from 0
   * @param perPage {int} Rows per page
   * @param orderBy? {string} Column name to sort with (ASC)
   * @returns {Promise}
   */
  list(page = 0, perPage = 5, orderBy = 'id') {
    const oredered = this._orderBy(this.data, orderBy)
    const result = this._paginate(oredered, page, perPage)

    return this._promise(result)
  }

  /**
   * Will update a row in the database
   * @param object New object value
   * @returns {Promise}
   */
  update(object) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.data.findIndex(el => el.id === object.id)

        if (index === -1) {
          reject('not found')
        } else {
          this.data[index] = object
          resolve(object)
        }
      }, 200)
    })
  }

  /**
   * @param arr {Object[]} Data to paginate
   * @param page {int} Page index starting from 0
   * @param perPage {int} Rows per page. Maximum value is 5.
   * @returns {Object} Object with paginated result and metadata with pagination info
   * @private
   */
  _paginate(arr, page, perPage) {
    perPage = 5 // "Maximum page size is 5 elements" (from Features and limitations);
    const paginatedArr = arr.slice(page * perPage, (page + 1) * perPage)
    const result = this._cloneAll(paginatedArr)

    return {
      data: result,
      meta: {
        total: arr.length,
        page: page,
        per_page: perPage,
        items: result.length,
      },
    }
  }

  /**
   * Sorts an array with provided value name
   * @param arr {Object[]} array of object to sort
   * @param attr {string} field name to sort with
   * @return {Object[]} Sorted array
   * @private
   */
  _orderBy(arr, attr) {
    // I offer to make descending sorting too

    return arr.sort((a, b) => {
      if (a[attr] < b[attr]) return -1
      if (a[attr] > b[attr]) return 1

      return 0
    })
  }

  /**
   * Wraps any result in promise with desired resolving timeout
   * @param result Any data
   * @param timeout {int} Timeout in milliseconds
   * @return {Promise}
   * @private
   */
  _promise(result, timeout = 100) {
    return new Promise(resolve => setTimeout(() => resolve(result), timeout))
  }

  /**
   * Clones array with all objects inside and returns its copy
   * @param arr {Object[]} array of objects to clone
   * @returns {Array} cloned array
   * @private
   */
  _cloneAll(arr) {
    return arr.map(item => this._clone(item))
  }

  /**
   * Clones object and returns its copy
   * @param obj {Object} object to clone
   * @returns {Object} cloned object
   * @private
   */
  _clone(obj) {
    return { ...obj }
  }
}
