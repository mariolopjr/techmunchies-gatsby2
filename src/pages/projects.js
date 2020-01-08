import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Columns from "../components/columns"
import Container from "../components/container"
import Project from "../components/project"
import Section from "../components/section"

import { css } from "@emotion/core"
import styled from "@emotion/styled"
import { mq } from "../components/styles"

const PostHero = styled.div({
  color: "white",
})

const PostHeroTitle = styled.h1({
  color: "white",
  fontSize: "2rem",
  fontWeight: 500,
  lineHeight: 1.125,
  marginBottom: "1.5rem",
  wordBreak: "break-word",

  [mq[0]]: {
    fontSize: "3rem",
    fontWeight: 600,
  },
})

const PostHeroContent = styled.div({
  fontSize: "1.5rem",
  fontWeight: 400,
  marginBottom: "1.8em",
  opacity: 0.8,

  [mq[0]]: {
    fontSize: "2rem",
    marginBottom: "1.2em",
  },
})

const projectStyles = css({
  marginBottom: "2rem",

  [mq[0]]: {
    marginBottom: 0,
  },
})

const ProjectPage = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark
  const covers = data.allFile.edges.reduce((arr, img) => {
    arr[img.node.relativeDirectory] = img.node.childImageSharp.fluid
    return arr
  }, {})

  return (
    <Layout>
      <SEO title="projects" />
      <Section>
        <Container>
          <PostHero>
            <PostHeroTitle>our projects</PostHeroTitle>
            <PostHeroContent>
              We love to create blazing fast and beautiful sites, that are
              maintenance free, allowing your company to focus on more important
              issues.
            </PostHeroContent>
          </PostHero>
          <Columns>
            {posts.map(({ node: project }) => (
              <Project
                key={project.id}
                cover={covers[project.parent.relativeDirectory]}
                styles={projectStyles}
                tagline={project.frontmatter.tagline}
                title={project.frontmatter.title}
                to={project.fields.slug}
              />
            ))}
          </Columns>
        </Container>
      </Section>
    </Layout>
  )
}

export default ProjectPage

export const pageQuery = graphql`
  query ProjectPageQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: {
        fileAbsolutePath: { regex: "/projects/" }
        frontmatter: { draft: { ne: true } }
      }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            date
            tagline
          }
          html
          parent {
            ... on File {
              relativeDirectory
            }
          }
        }
      }
    }
    allFile(
      filter: {
        sourceInstanceName: { eq: "content" }
        relativePath: { regex: "/projects/" }
        extension: { in: ["jpg", "png"] }
      }
    ) {
      edges {
        node {
          id
          childImageSharp {
            fluid(maxWidth: 570) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
          relativeDirectory
        }
      }
    }
  }
`
