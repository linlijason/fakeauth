<#macro layout cur_page=1 total_page=0>
<nav class="text-right">
  <ul class="pagination">
    <li class="<#if cur_page <= 1 >disabled</#if>">
      <a href="javascript:void(0)" aria-label="First" data-pageto="1"><span aria-hidden="true">&laquo;</span></a>
    </li>
    <li class="<#if cur_page <= 1 >disabled</#if>">
      <a href="javascript:void(0)" aria-label="Previous" data-pageto="${cur_page-1}"><span
        aria-hidden="true">&lt;</span></a>
    </li>
  <#--固定显示show_count个数字块-->
    <#assign show_count = 10>
    <#assign show_start = 1 >
    <#assign show_end = total_page >
    <#if show_count < total_page>
      <#assign tmp = total_page - show_count + 1>
      <#if tmp < cur_page>
        <#assign show_start = tmp >
      <#else >
        <#if cur_page - 2 < 1>
          <#assign show_start = 1 >
        <#else >
          <#assign show_start = cur_page - 2 >
        </#if>
      </#if>
      <#if show_start + show_count < total_page>
        <#assign show_end = show_start + show_count >
      </#if>
    </#if>
  <#--${show_start}~${show_end}-->
    <#if 1<show_start >
      <li class="">
        <span aria-hidden="true">...</span>
      </li>
    </#if>
    <#list show_start..show_end as i >
      <li class="<#if cur_page == i >active</#if>">
        <a href="javascript:void(0)" data-pageto="${i}">${i}</a>
      </li>
    </#list>
    <#if show_end < total_page >
      <li class="">
        <span aria-hidden="true">...</span>
      </li>
    </#if>
    <li class="<#if total_page <= cur_page >disabled</#if>">
      <a href="javascript:void(0)" aria-label="Next" data-pageto="${cur_page+1}"> <span
        aria-hidden="true">&gt;</span></a>
    </li>
    <li class="<#if total_page <= cur_page >disabled</#if>">
      <a href="javascript:void(0)" aria-label="Last" data-pageto="${total_page}"> <span
        aria-hidden="true">&raquo;</span></a>
    </li>
  </ul>
</nav>
</#macro>
