---
title: About me
layout: post
---

#### Employment

---

<style>
.job {
    display: flex;
    align-items: flex-start;

}

.job-icon {
    margin: unset;
    display: flex;
    align-items: flex-start;
}

.job>img, .job>div {
    margin: 20px;
}
</style>

{% for job in site.data.jobs %}

<div class="job">
    <image class="job-icon" src="/assets/company-icons/{{ job.image }}.png" />
    <div class="description"> 
        <h4>{{ job.name }}</h4>
        <div>{{ job.description }}</div>
        <i>{{ job.date }}</i>
    </div>
</div>
{% endfor %}

#### Education

---

{% for job in site.data.education %}

<div class="job">
    <image class="job-icon" src="/assets/company-icons/{{ job.image }}.png" />
    <div class="description"> 
        <h4>{{ job.name }}</h4>
        <div>{{ job.description }}</div>
        <i>{{ job.date }}</i>
    </div>
</div>

{% endfor %}
