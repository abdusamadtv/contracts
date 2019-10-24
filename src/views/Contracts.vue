<template>
  <div class="contracts">
    <div class="contract-types">
      <el-radio v-model="currentType" label="sold">Sold contracts</el-radio>
      <el-radio v-model="currentType" label="purchased">Purchased contracts</el-radio>
    </div>
    <el-table :data="currentContracts" style="width: 900px;">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="sid" label="Seller ID"></el-table-column>
      <el-table-column prop="cid" label="Client ID"></el-table-column>
      <el-table-column prop="number" label="Number"></el-table-column>
      <el-table-column prop="signed_at" label="Signed at"></el-table-column>
      <el-table-column prop="valid_till" label="Valid till"></el-table-column>
      <el-table-column label="Actions" width="100">
        <template slot-scope="scope">
          <el-button
            @click="showEditDialog(scope.row)"
            type="warning"
            title="Edit contract"
            round
            size="small"
            icon="el-icon-edit-outline"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentPageChange"
      :current-page.sync="currentPage"
      :page-size="5"
      layout="total, prev, pager, next, jumper"
      :total="currentItemsTotal"
    ></el-pagination>
    <el-dialog title="Edit contract" :visible.sync="editContractDialog" center>
      <el-form ref="form" :model="currentContract" label-width="120px">
        <el-form-item label="Number">
          <el-input v-model="currentContract.number"></el-input>
        </el-form-item>
        <el-form-item label="Signed at">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="Pick a date"
              v-model="currentContract.signed_at"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="Valid Till">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="Pick a date"
              v-model="currentContract.valid_till"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog()">Cancel</el-button>
        <el-button type="primary" @click="saveContract(currentContract)">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { Contracts } from '@/services/resources'

const contracts = new Contracts()

export default {
  name: 'Contracts',
  data() {
    return {
      currentPage: 1,
      currentType: 'sold',
      currentContract: {},
      soldItemsTotal: 0,
      soldContracts: [],
      purchasedItemsTotal: 0,
      purchasedContracts: [],
      editContractDialog: false,
    }
  },
  computed: {
    currentContracts() {
      return this.currentType === 'sold' ? this.soldContracts : this.purchasedContracts
    },
    currentItemsTotal() {
      return this.currentType === 'sold' ? this.soldItemsTotal : this.purchasedItemsTotal
    },
  },
  watch: {
    currentType() {
      this.currentPage = 1
      this.getContracts(this.currentType)
    },
  },
  methods: {
    async saveContract(contract) {
      let signedAt = contract.signed_at
      let validTill = contract.valid_till

      contract.signed_at = moment(signedAt).format('YYYY-MM-DD')
      contract.valid_till = moment(validTill).format('YYYY-MM-DD')

      await contracts.update(contract).then(() => {
        this.editContractDialog = false
      })
    },
    closeEditDialog() {
      this.editContractDialog = false
    },
    showEditDialog(contract) {
      this.currentContract = contract
      this.editContractDialog = true
    },
    handleCurrentPageChange(val) {
      this.currentPage = val
      this.getContracts(this.currentType)
    },
    async getContracts(type) {
      let companyId = Number(this.$route.params.companyId)
      let column = this.currentType === 'sold' ? 'sid' : 'cid'

      await contracts.getBatch(column, [companyId], this.currentPage - 1, 5, 'number').then(resp => {
        this[`${type}Contracts`] = resp.data
        this[`${type}ItemsTotal`] = resp.meta.total
      })
    },
  },
  created() {
    this.getContracts(this.currentType)
  },
}
</script>

<style lang="scss">
.contracts {
  .contract-types {
    margin-bottom: 30px;
  }
  .el-table {
    margin: 0 auto;
  }
  .el-pagination {
    margin-top: 30px;
  }
}
</style>
