<template>
    <div class="companies">
        <el-table :data="companies" style="width: 700px;">
            <el-table-column prop="id" label="ID" width="180">
            </el-table-column>
            <el-table-column prop="name" label="Name">
            </el-table-column>
            <el-table-column label="Contracts" width="180">
                <template slot-scope="scope">
                    <router-link :to="{name: 'contracts', params: { companyId: scope.row.id }}" class="router-link el-button el-button--primary el-button--mini is-round">Contracts</router-link>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentPageChange" :current-page.sync="currentPage" :page-size="5" layout="total, prev, pager, next, jumper" :total="totalItems">
        </el-pagination>
    </div>
</template>

<script>
import { Companies } from '@/services/resources';

const companies = new Companies();

export default {
  name: 'Companies',
  data() {
    return {
      currentPage: 1,
      totalItems: 0,
      companies: []
    };
  },
  methods: {
    handleCurrentPageChange(val) {
      this.currentPage = val;
      this.getCompanies();
    },
    async getCompanies() {
      await companies.list(this.currentPage - 1, 5, 'name').then(resp => {
        this.companies = resp.data;
        this.totalItems = resp.meta.total;
      });
    }
  },
  created() {
    this.getCompanies();
  }
};
</script>

<style lang="scss">
.companies {
  .el-table {
    margin: 0 auto;
  }
  a.router-link {
    text-decoration: none;
  }
  .el-pagination {
    margin-top: 30px;
  }
}
</style>
