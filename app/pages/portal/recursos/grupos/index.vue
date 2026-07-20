<template>
  <section class="login-page">
    <div class="form">
         <CCardAlt
          title="Titulo"
          description="Tarjeta habilitada con link"
          small="Texto pequeño"
          interactive
          to="/design"
          ><template #footer>
            <span
              class="flex items-center gap-x-2 self-end text-sm font-semibold"
              >Ver más
              <Icon
                name="icon-park-outline:arrow-right"
                class="inline-block duration-300 ease-in-out"
              />
            </span> </template
        ></CCardAlt>
    </div>
  </section>
</template>