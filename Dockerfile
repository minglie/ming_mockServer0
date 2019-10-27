FROM node:alpine
COPY . ~
RUN cd ~  && npm install ming_node
WORKDIR ~
CMD ['node', 'index.js']

